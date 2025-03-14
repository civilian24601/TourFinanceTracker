import { users, tours, expenses, type User, type InsertUser, type Tour, type InsertTour, type Expense, type InsertExpense } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tours: Map<number, Tour>;
  private expenses: Map<number, Expense>;
  private currentId: { user: number; tour: number; expense: number };
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.tours = new Map();
    this.expenses = new Map();
    this.currentId = { user: 1, tour: 1, expense: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
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
    const id = this.currentId.user++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTour(tour: InsertTour & { userId: number }): Promise<Tour> {
    const id = this.currentId.tour++;
    const newTour: Tour = { ...tour, id };
    this.tours.set(id, newTour);
    return newTour;
  }

  async getToursByUser(userId: number): Promise<Tour[]> {
    return Array.from(this.tours.values()).filter(
      (tour) => tour.userId === userId,
    );
  }

  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async createExpense(expense: InsertExpense & { userId: number }): Promise<Expense> {
    const id = this.currentId.expense++;
    const newExpense: Expense = { ...expense, id };
    this.expenses.set(id, newExpense);
    return newExpense;
  }

  async getExpensesByTour(tourId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => expense.tourId === tourId,
    );
  }

  async getExpensesByUser(userId: number): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(
      (expense) => expense.userId === userId,
    );
  }
}

export const storage = new MemStorage();
