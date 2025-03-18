import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

function getCallbackUrl(provider: string) {
  const baseUrl = process.env.REPL_ID
    ? `https://${process.env.REPL_ID}-00-260iqc51qwukq.worf.replit.dev`
    : "https://workspace.alexrichardhaye.repl.co";
  console.log(`Generated callback URL for ${provider}:`, `${baseUrl}/api/auth/${provider}/callback`);
  return `${baseUrl}/api/auth/${provider}/callback`;
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const PostgresSessionStore = connectPg(session);

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      httpOnly: true
    },
    store: new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'session',
      pruneSessionInterval: 60 * 15,
      errorLog: console.error
    }),
    name: 'tour-tracker.sid'
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: getCallbackUrl("google"),
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google auth attempt:', profile.id);
          let user = await storage.getUserByUsername(`google:${profile.id}`);

          if (!user) {
            console.log('Creating new Google user:', profile.id);
            user = await storage.createUser({
              username: `google:${profile.id}`,
              password: await hashPassword(randomBytes(32).toString("hex")),
            });
          }

          console.log('Google auth successful:', user.id);
          return done(null, user);
        } catch (error) {
          console.error('Google auth error:', error);
          return done(error);
        }
      }
    )
  );

  // GitHub Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: getCallbackUrl("github"),
        proxy: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('GitHub auth attempt:', profile.id);
          let user = await storage.getUserByUsername(`github:${profile.id}`);

          if (!user) {
            console.log('Creating new GitHub user:', profile.id);
            user = await storage.createUser({
              username: `github:${profile.id}`,
              password: await hashPassword(randomBytes(32).toString("hex")),
            });
          }

          console.log('GitHub auth successful:', user.id);
          return done(null, user);
        } catch (error) {
          console.error('GitHub auth error:', error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.log('User not found during deserialization:', id);
        return done(null, false);
      }
      console.log('Deserialized user:', id);
      done(null, user);
    } catch (error) {
      console.error('Deserialization error:', error);
      done(error);
    }
  });

  // Auth routes
  app.get("/api/auth/google", (req, res, next) => {
    console.log('Starting Google auth...');
    passport.authenticate("google", { 
      scope: ["profile", "email"],
      prompt: 'select_account'
    })(req, res, next);
  });

  app.get(
    "/api/auth/google/callback",
    (req, res, next) => {
      console.log('Google auth callback received', {
        query: req.query,
        headers: req.headers,
        session: req.session
      });
      passport.authenticate("google", { 
        failureRedirect: "/auth",
        successRedirect: "/",
        failureMessage: true
      })(req, res, next);
    }
  );

  app.get("/api/auth/github", (req, res, next) => {
    console.log('Starting GitHub auth...');
    passport.authenticate("github", { 
      scope: ["user:email"]
    })(req, res, next);
  });

  app.get(
    "/api/auth/github/callback",
    (req, res, next) => {
      console.log('GitHub auth callback received', {
        query: req.query,
        headers: req.headers,
        session: req.session
      });
      passport.authenticate("github", { 
        failureRedirect: "/auth",
        successRedirect: "/",
        failureMessage: true
      })(req, res, next);
    }
  );

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log('User check', {
      isAuthenticated: req.isAuthenticated(),
      session: req.session,
      user: req.user
    });
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    res.json(req.user);
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      authenticated: req.isAuthenticated(),
      user: req.user,
      session: req.session
    });
  });
}