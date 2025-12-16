import { type User, type InsertUser, type Contract, type InsertContract, users, contracts } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contract operations
  getAllContracts(): Promise<Contract[]>;
  getContractById(id: number): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  deleteContract(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllContracts(): Promise<Contract[]> {
    return await db.select().from(contracts).orderBy(desc(contracts.createdAt));
  }

  async getContractById(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || undefined;
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    // Generate unique contract number
    const year = new Date().getFullYear();
    const count = await db.select().from(contracts);
    const contractNumber = `CN-${year}-${(count.length + 1).toString().padStart(3, '0')}`;
    
    const [contract] = await db.insert(contracts).values({
      ...insertContract,
      contractNumber,
    }).returning();
    
    return contract;
  }

  async deleteContract(id: number): Promise<boolean> {
    const result = await db.delete(contracts).where(eq(contracts.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
