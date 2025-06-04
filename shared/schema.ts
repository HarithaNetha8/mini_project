import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  type: text("type", { enum: ["url", "screenshot"] }).notNull(),
  target: text("target").notNull(), // URL or filename
  verdict: text("verdict", { enum: ["safe", "phishing", "suspicious"] }).notNull(),
  confidence: integer("confidence").notNull(), // 0-100
  details: text("details").array(), // Array of detection details
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").references(() => scans.id).notNull(),
  isCorrect: boolean("is_correct").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertScanSchema = createInsertSchema(scans).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
