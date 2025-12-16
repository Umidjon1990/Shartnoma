import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContractSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { generateContractPdf } from "./pdf";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all contracts
  app.get("/api/contracts", async (req, res) => {
    try {
      const allContracts = await storage.getAllContracts();
      res.json(allContracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ error: "Failed to fetch contracts" });
    }
  });

  // Get contract by ID
  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }
      
      const contract = await storage.getContractById(id);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      
      res.json(contract);
    } catch (error) {
      console.error("Error fetching contract:", error);
      res.status(500).json({ error: "Failed to fetch contract" });
    }
  });

  // Generate PDF with custom data (for freshly created contracts)
  app.post("/api/contracts/generate-pdf", async (req, res) => {
    try {
      const { name, age, course, format, number, date } = req.body;
      
      if (!name || typeof name !== 'string' || name.length < 2 || name.length > 200) {
        return res.status(400).json({ error: "Invalid name field" });
      }
      if (!course || typeof course !== 'string') {
        return res.status(400).json({ error: "Invalid course field" });
      }
      if (!number || typeof number !== 'string') {
        return res.status(400).json({ error: "Invalid number field" });
      }
      
      const sanitizedName = name.replace(/[<>\"'&]/g, '');
      const sanitizedCourse = course.replace(/[<>\"'&]/g, '');
      const sanitizedNumber = number.replace(/[<>\"'&]/g, '');
      const sanitizedAge = (age || '').toString().replace(/[<>\"'&]/g, '');
      const sanitizedFormat = (format || 'Online').replace(/[<>\"'&]/g, '');

      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['host'] || 'localhost:5000';
      const baseUrl = `${protocol}://${host}`;
      
      const pdfBuffer = await generateContractPdf({
        name: sanitizedName,
        age: sanitizedAge,
        course: sanitizedCourse,
        format: sanitizedFormat,
        number: sanitizedNumber,
        date: date || new Date().toLocaleDateString('uz-UZ')
      }, baseUrl);

      const filename = `Shartnoma_${sanitizedNumber}_${sanitizedName.replace(/\s+/g, '_')}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // Generate PDF for contract
  app.get("/api/contracts/:id/pdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid contract ID" });
      }
      
      const contract = await storage.getContractById(id);
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }

      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['host'] || 'localhost:5000';
      const baseUrl = `${protocol}://${host}`;
      
      const pdfBuffer = await generateContractPdf({
        name: contract.studentName,
        age: contract.age,
        course: contract.course,
        format: contract.format,
        number: contract.contractNumber,
        date: new Date(contract.createdAt).toLocaleDateString('uz-UZ')
      }, baseUrl);

      const filename = `Shartnoma_${contract.contractNumber}_${contract.studentName.replace(/\s+/g, '_')}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  // Create new contract
  app.post("/api/contracts", async (req, res) => {
    try {
      const result = insertContractSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ error: validationError.message });
      }

      const contract = await storage.createContract(result.data);
      
      // Send Telegram notification (if configured)
      await sendTelegramNotification(contract);
      
      res.status(201).json(contract);
    } catch (error) {
      console.error("Error creating contract:", error);
      res.status(500).json({ error: "Failed to create contract" });
    }
  });

  return httpServer;
}

// Telegram notification helper
async function sendTelegramNotification(contract: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log("Telegram not configured, skipping notification");
    return;
  }

  try {
    const message = `
🎓 *Yangi Shartnoma Tuzildi!*

📝 Shartnoma №: \`${contract.contractNumber}\`
👤 O'quvchi: *${contract.studentName}*
📞 Telefon: ${contract.phone}
🎂 Yosh: ${contract.age}
📚 Kurs: *${contract.course}*
💻 Format: ${contract.format}
📅 Sana: ${new Date(contract.createdAt).toLocaleString('uz-UZ')}

✅ Status: Imzolangan
    `.trim();

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      console.error("Telegram notification failed:", await response.text());
    } else {
      console.log("Telegram notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}
