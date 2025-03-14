import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTourSchema, insertExpenseSchema } from "@shared/schema";
import { predictExpenseCategory } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Tours
  app.post("/api/tours", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertTourSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const tour = await storage.createTour({
      ...parsed.data,
      userId: req.user.id,
    });
    res.status(201).json(tour);
  });

  app.get("/api/tours", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tours = await storage.getToursByUser(req.user.id);
    res.json(tours);
  });

  // Expenses
  app.post("/api/expenses", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const parsed = insertExpenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    if (parsed.data.description) {
      const prediction = await predictExpenseCategory(
        parsed.data.description,
        Number(parsed.data.amount)
      );
      
      if (prediction.confidence > 0.8) {
        parsed.data.category = prediction.category;
      }
    }

    const expense = await storage.createExpense({
      ...parsed.data,
      userId: req.user.id,
    });
    res.status(201).json(expense);
  });

  app.get("/api/expenses", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const tourId = req.query.tourId;
    let expenses;
    
    if (tourId && typeof tourId === 'string') {
      expenses = await storage.getExpensesByTour(parseInt(tourId, 10));
    } else {
      expenses = await storage.getExpensesByUser(req.user.id);
    }
    
    res.json(expenses);
  });

  const httpServer = createServer(app);
  return httpServer;
}
