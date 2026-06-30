import express, { type Express } from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import router from "./routes";
import { logger } from "./lib/logger";
import { pool } from "@workspace/db";

const app: Express = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const PgSession = connectPgSimple(session);

function resolveFrontendDir(): string | null {
  const candidates = [
    process.env.FRONTEND_DIR,
    path.resolve(
      fileURLToPath(new URL(".", import.meta.url)),
      "../../jit-website/dist/public",
    ),
    path.resolve(process.cwd(), "artifacts/jit-website/dist/public"),
    path.resolve(process.cwd(), "../jit-website/dist/public"),
  ].filter((value): value is string => Boolean(value));

  for (const candidate of candidates) {
    const indexPath = path.join(candidate, "index.html");
    if (fs.existsSync(indexPath)) {
      return candidate;
    }
  }

  return null;
}

function setupFrontend(app: Express): void {
  const frontendDir = resolveFrontendDir();

  if (!frontendDir) {
    logger.warn("Frontend build not found; client-side routes like /admin will 404");
    return;
  }

  logger.info({ frontendDir }, "Serving frontend static files");

  const staticMiddleware = express.static(frontendDir, { fallthrough: true });

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }

    staticMiddleware(req, res, (err) => {
      if (err) {
        return next(err);
      }

      if (res.headersSent) {
        return;
      }

      if (req.method !== "GET" && req.method !== "HEAD") {
        return next();
      }

      res.sendFile(path.join(frontendDir, "index.html"), (sendErr) => {
        if (sendErr) {
          next(sendErr);
        }
      });
    });
  });
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use("/api", router);

if (process.env.NODE_ENV === "production") {
  setupFrontend(app);
}

export default app;
