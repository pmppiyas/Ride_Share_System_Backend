import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { AppError } from "../Error/appError";

export const validateRequest =
  (ZodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await ZodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      throw new AppError(400, "Object is undefined or not valid");
      next(error);
    }
  };
