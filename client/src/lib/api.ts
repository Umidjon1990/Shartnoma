import { type Contract, type InsertContract } from "@shared/schema";

const API_BASE = "/api";

export async function fetchContracts(): Promise<Contract[]> {
  const response = await fetch(`${API_BASE}/contracts`);
  if (!response.ok) {
    throw new Error("Failed to fetch contracts");
  }
  return response.json();
}

export async function fetchContractById(id: number): Promise<Contract> {
  const response = await fetch(`${API_BASE}/contracts/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch contract");
  }
  return response.json();
}

export async function createContract(data: InsertContract): Promise<Contract> {
  const response = await fetch(`${API_BASE}/contracts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create contract");
  }
  
  return response.json();
}
