import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import cors from "cors";
import { setupAuth } from "./auth";

const app = express();

// Essential middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup CORS before session and auth
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    cookies: req.headers.cookie,
    sessionID: req.headers['cookie']?.match(/tour-tracker\.sid=([^;]+)/)?.[1]
  });
  next();
});

// Setup auth (which includes session configuration)
setupAuth(app);

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

(async () => {
  try {
    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Server error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    const server = await registerRoutes(app);

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Request timeout middleware (from original code)
    app.use((req: Request, res: Response, next: NextFunction) => {
      // Set timeout to 30 seconds
      req.setTimeout(30000, () => {
        const err = new Error('Request Timeout');
        (err as any).status = 408;
        next(err);
      });
      next();
    });

    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();