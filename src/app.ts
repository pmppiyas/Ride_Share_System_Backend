import cors from "cors";
import express, { Request, Response } from "express";
import express from "express";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.status(201).send({
    success: true,
    message: "Hello, Welcome to Ride Shere Server",
  });
});

export default app;
