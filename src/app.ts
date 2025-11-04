import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import session from "express-session";
import passport from "passport";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import router from "./app/Routes/index";
import { envVars } from "./config/env";
import "./config/passport";

const app = express();

app.use(
  session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: envVars.NODE_ENV === "production" ? true : false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  envVars.FRONTEND_URL1,
  envVars.FRONTEND_URL2,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.set("trust proxy", 1);
app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(201).send({
    success: true,
    message: "Hello, Welcome to Ride Shere Server",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
