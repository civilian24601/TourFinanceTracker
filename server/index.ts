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
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Setup session and auth before routing and error handling
app.set("trust proxy", 1);

(async () => {
  try {
    const server = await registerRoutes(app);

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

    // Error handling middleware should be first
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

    // Request logging
    app.use((req, res, next) => {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse: Record<string, any> | undefined = undefined;

      // Log session information
      console.log('Session ID:', req.sessionID);
      console.log('Is Authenticated:', req.isAuthenticated());
      if (req.user) {
        console.log('User ID:', req.user.id);
      }

      const originalResJson = res.json;
      res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };

      res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }

          if (logLine.length > 80) {
            logLine = logLine.slice(0, 79) + "…";
          }

          log(logLine);
        }
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