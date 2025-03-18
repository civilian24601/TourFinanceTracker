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
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createTour(tour: InsertTour & { userId: number }): Promise<Tour> {
    try {
      const [newTour] = await db.insert(tours).values({
        name: tour.name,
        userId: tour.userId,
        startDate: new Date(tour.startDate),
        endDate: new Date(tour.endDate),
        budget: tour.budget
      }).returning();
      return newTour;
    } catch (error) {
      console.error('Error creating tour:', error);
      throw error;
    }
  }

  async getToursByUser(userId: number): Promise<Tour[]> {
    try {
      return await db.select().from(tours).where(eq(tours.userId, userId));
    } catch (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
  }

  async getTour(id: number): Promise<Tour | undefined> {
    try {
      const [tour] = await db.select().from(tours).where(eq(tours.id, id));
      return tour;
    } catch (error) {
      console.error('Error fetching tour:', error);
      throw error;
    }
  }

  async createExpense(expense: InsertExpense & { userId: number }): Promise<Expense> {
    try {
      const [newExpense] = await db.insert(expenses).values({
        tourId: expense.tourId,
        userId: expense.userId,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: new Date(expense.date),
        offlineId: expense.offlineId
      }).returning();
      return newExpense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  async getExpensesByTour(tourId: number): Promise<Expense[]> {
    try {
      return await db.select().from(expenses).where(eq(expenses.tourId, tourId));
    } catch (error) {
      console.error('Error fetching expenses by tour:', error);
      throw error;
    }
  }

  async getExpensesByUser(userId: number): Promise<Expense[]> {
    try {
      return await db.select().from(expenses).where(eq(expenses.userId, userId));
    } catch (error) {
      console.error('Error fetching expenses by user:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();