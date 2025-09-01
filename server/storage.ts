import { users, scans, feedback, type User, type InsertUser, type Scan, type InsertScan, type Feedback, type InsertFeedback } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Scan operations
  createScan(scan: InsertScan): Promise<Scan>;
  getScan(id: number): Promise<Scan | undefined>;
  getScans(limit?: number, offset?: number): Promise<Scan[]>;
  getScansByType(type: "url" | "screenshot", limit?: number): Promise<Scan[]>;
  
  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbackByScanId(scanId: number): Promise<Feedback | undefined>;
  
  // Stats
  getStats(): Promise<{
    totalScans: number;
    safeCount: number;
    phishingCount: number;
    suspiciousCount: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scans: Map<number, Scan>;
  private feedbacks: Map<number, Feedback>;
  private currentUserId: number;
  private currentScanId: number;
  private currentFeedbackId: number;

  constructor() {
    this.users = new Map();
    this.scans = new Map();
    this.feedbacks = new Map();
    this.currentUserId = 1;
    this.currentScanId = 1;
    this.currentFeedbackId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const id = this.currentScanId++;
    const scan: Scan = { 
      ...insertScan, 
      id, 
      createdAt: new Date(),
      details: insertScan.details || null
    };
    this.scans.set(id, scan);
    return scan;
  }

  async getScan(id: number): Promise<Scan | undefined> {
    return this.scans.get(id);
  }

  async getScans(limit = 50, offset = 0): Promise<Scan[]> {
    const allScans = Array.from(this.scans.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return allScans.slice(offset, offset + limit);
  }

  async getScansByType(type: "url" | "screenshot", limit = 50): Promise<Scan[]> {
    const filtered = Array.from(this.scans.values())
      .filter(scan => scan.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return filtered.slice(0, limit);
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.currentFeedbackId++;
    const feedback: Feedback = { 
      ...insertFeedback, 
      id, 
      createdAt: new Date(),
      comment: insertFeedback.comment || null
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async getFeedbackByScanId(scanId: number): Promise<Feedback | undefined> {
    return Array.from(this.feedbacks.values()).find(
      feedback => feedback.scanId === scanId
    );
  }

  async getStats(): Promise<{
    totalScans: number;
    safeCount: number;
    phishingCount: number;
    suspiciousCount: number;
  }> {
    const allScans = Array.from(this.scans.values());
    return {
      totalScans: allScans.length,
      safeCount: allScans.filter(s => s.verdict === "safe").length,
      phishingCount: allScans.filter(s => s.verdict === "phishing").length,
      suspiciousCount: allScans.filter(s => s.verdict === "suspicious").length,
    };
  }
}

export const storage = new MemStorage();
