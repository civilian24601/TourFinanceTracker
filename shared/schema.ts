import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
});

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tourId: integer("tour_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  offlineId: text("offline_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTourSchema = createInsertSchema(tours)
  .pick({
    name: true,
    startDate: true,
    endDate: true,
    budget: true,
  })
  .extend({
    startDate: z.string(),
    endDate: z.string(),
    budget: z.number().min(0, "Budget must be positive"),
  });

export const insertExpenseSchema = createInsertSchema(expenses)
  .pick({
    amount: true,
    category: true,
    description: true,
    date: true,
    tourId: true,
    offlineId: true,
  })
  .extend({
    amount: z.number().min(0, "Amount must be positive").or(
      z.string().transform((val) => {
        const num = Number(val);
        if (isNaN(num)) throw new Error("Invalid amount");
        return num;
      })
    ),
    date: z.string(),
    tourId: z.number().nullable(),
  });

export const categories = [
  "travel",
  "lodging",
  "food",
  "gear",
  "merchandise",
  "promotion",
  "other"
] as const;

export type Category = typeof categories[number];
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type User = typeof users.$inferSelect;
export type Tour = typeof tours.$inferSelect;
export type Expense = typeof expenses.$inferSelect;