import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  contractNumber: varchar("contract_number", { length: 50 }).notNull().unique(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  age: varchar("age", { length: 10 }).notNull(),
  course: varchar("course", { length: 50 }).notNull(),
  format: varchar("format", { length: 50 }).notNull().default("Online"),
  status: varchar("status", { length: 50 }).notNull().default("signed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  contractNumber: true,
  createdAt: true,
});

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;
