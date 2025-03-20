import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTourSchema, insertExpenseSchema } from "@shared/schema";
import { predictExpenseCategory, generateFinancialInsights } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Tours
  app.post("/api/tours", async (req, res) => {
    // Test minimal logging
    console.log('Tour creation attempt:', {
      sessionID: req.sessionID,
      cookie: req.headers.cookie,
      reqPath: req.path,
      auth: req.isAuthenticated()
    });

    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = insertTourSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    try {
      const tour = await storage.createTour({
        ...parsed.data,
        userId: req.user.id,
      });
      res.status(201).json(tour);
    } catch (error) {
      console.error('Error creating tour:', error);
      res.status(500).json({ message: "Failed to create tour" });
    }
  });

  app.get("/api/tours", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const tours = await storage.getToursByUser(req.user.id);
      console.log('Tours fetched for user:', {
        userId: req.user.id,
        sessionID: req.sessionID,
        toursCount: tours.length,
        tours: tours
      });
      res.json(tours);
    } catch (error) {
      console.error('Error fetching tours:', error);
      res.status(500).json({ message: "Failed to fetch tours" });
    }
  });

  app.get("/api/tours/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const tourId = parseInt(req.params.id, 10);
    if (isNaN(tourId)) {
      return res.status(400).json({ message: "Invalid tour ID" });
    }

    try {
      const tour = await storage.getTour(tourId);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }

      // Only allow access to tours owned by the authenticated user
      if (tour.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      console.log('Tour details fetched:', {
        tourId,
        userId: req.user.id,
        sessionID: req.sessionID,
        tour
      });
      res.json(tour);
    } catch (error) {
      console.error('Error fetching tour:', error);
      res.status(500).json({ message: "Failed to fetch tour details" });
    }
  });

  // Add DELETE tour endpoint
  app.delete("/api/tours/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const tourId = parseInt(req.params.id, 10);
    if (isNaN(tourId)) {
      return res.status(400).json({ message: "Invalid tour ID" });
    }

    try {
      const tour = await storage.getTour(tourId);
      if (!tour) {
        return res.status(404).json({ message: "Tour not found" });
      }

      // Only allow deletion of tours owned by the authenticated user
      if (tour.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteTour(tourId);
      console.log('Tour deleted successfully:', { tourId, userId: req.user.id, sessionID: req.sessionID });
      res.sendStatus(200);
    } catch (error) {
      console.error('Error deleting tour:', error);
      res.status(500).json({ message: "Failed to delete tour" });
    }
  });


  // Expenses
  app.post("/api/expenses", async (req, res) => {
    console.log('POST /api/expenses - Auth status:', req.isAuthenticated(), 'User:', req.user?.id);

    if (!req.isAuthenticated()) {
      console.log('Unauthorized attempt to create expense');
      return res.status(401).json({ message: "Unauthorized" });
    }

    const parsed = insertExpenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    try {
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
      console.log('Expense created successfully:', expense.id);
      res.status(201).json(expense);
    } catch (error) {
      console.error('Error creating expense:', error);
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  app.get("/api/expenses", async (req, res) => {
    console.log('GET /api/expenses - Auth status:', req.isAuthenticated(), 'User:', req.user?.id);
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const tourId = req.query.tourId;
      let expenses;

      if (tourId && typeof tourId === 'string') {
        expenses = await storage.getExpensesByTour(parseInt(tourId, 10));
        console.log('Expenses fetched for tour:', {
          tourId,
          count: expenses.length,
          expenses
        });
      } else {
        expenses = await storage.getExpensesByUser(req.user.id);
        console.log('Expenses fetched for user:', {
          userId: req.user.id,
          count: expenses.length,
          expenses
        });
      }

      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  // AI Insights
  app.get("/api/insights", async (req, res) => {
    console.log('GET /api/insights - Auth status:', req.isAuthenticated(), 'User:', req.user?.id);
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const tourId = req.query.tourId;
    let expenses;
    let budget = 0;

    try {
      if (tourId && typeof tourId === 'string') {
        const tour = await storage.getTour(parseInt(tourId, 10));
        if (!tour) {
          return res.status(404).json({ message: "Tour not found" });
        }
        expenses = await storage.getExpensesByTour(tour.id);
        budget = Number(tour.budget);
        console.log('Insights generated for tour:', {
          tourId,
          expenseCount: expenses.length,
          budget
        });
      } else {
        expenses = await storage.getExpensesByUser(req.user.id);
        const tours = await storage.getToursByUser(req.user.id);
        budget = tours.reduce((sum, tour) => sum + Number(tour.budget), 0);
        console.log('Insights generated for user:', {
          userId: req.user.id,
          expenseCount: expenses.length,
          tourCount: tours.length,
          totalBudget: budget
        });
      }

      const insights = await generateFinancialInsights(
        expenses.map(e => ({
          amount: Number(e.amount),
          category: e.category,
          date: e.date.toISOString(),
        })),
        budget
      );

      res.json(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}