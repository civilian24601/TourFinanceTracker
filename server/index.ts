import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import cors from "cors";

const app = express();

// Essential middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup CORS before session and auth
app.use(cors({
  origin: [
    'https://workspace.alexrichardhaye.repl.co',
    new RegExp(`^https://${process.env.REPL_ID}-00-.*\\.worf\\.replit\\.dev$`),
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));

// Setup session and auth before routing and error handling
app.set("trust proxy", 1);

(async () => {
  try {
    const server = await registerRoutes(app);

    // Request logging middleware should be first
    app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`, {
        headers: req.headers,
        cookies: req.cookies,
        session: req.session
      });
      next();
    });

    // Request timeout middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
      // Set timeout to 30 seconds
      req.setTimeout(30000, () => {
        const err = new Error('Request Timeout');
        err.status = 408;
        next(err);
      });
      next();
    });

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Server error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

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