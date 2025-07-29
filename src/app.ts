import cors from "cors";
import express, { Request, Response } from "express";
import router from "./app/Routes/index";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";

const app = express();
app.use(express.json());
app.use(cors());

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
