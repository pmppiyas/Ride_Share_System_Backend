import cors from "cors";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import router from "./app/Routes/index";
import passport from "passport";
import session from "express-session";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { envVars } from "./config/env";

const app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use(
  session({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: envVars.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

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
