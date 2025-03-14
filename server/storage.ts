import { users, tours, expenses, type User, type InsertUser, type Tour, type InsertTour, type Expense, type InsertExpense } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createTour(tour: InsertTour & { userId: number }): Promise<Tour>;
  getToursByUser(userId: number): Promise<Tour[]>;
  getTour(id: number): Promise<Tour | undefined>;

  createExpense(expense: InsertExpense & { userId: number }): Promise<Expense>;
  getExpensesByTour(tourId: number): Promise<Expense[]>;
  getExpensesByUser(userId: number): Promise<Expense[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createTour(tour: InsertTour & { userId: number }): Promise<Tour> {
    const [newTour] = await db.insert(tours).values(tour).returning();
    return newTour;
  }

  async getToursByUser(userId: number): Promise<Tour[]> {
    return db.select().from(tours).where(eq(tours.userId, userId));
  }

  async getTour(id: number): Promise<Tour | undefined> {
    const [tour] = await db.select().from(tours).where(eq(tours.id, id));
    return tour;
  }

  async createExpense(expense: InsertExpense & { userId: number }): Promise<Expense> {
    const [newExpense] = await db.insert(expenses).values(expense).returning();
    return newExpense;
  }

  async getExpensesByTour(tourId: number): Promise<Expense[]> {
    return db.select().from(expenses).where(eq(expenses.tourId, tourId));
  }

  async getExpensesByUser(userId: number): Promise<Expense[]> {
    return db.select().from(expenses).where(eq(expenses.userId, userId));
  }
}

export const storage = new DatabaseStorage();