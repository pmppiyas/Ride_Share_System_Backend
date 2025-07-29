import { z } from "zod";
import { Role } from "./rider.interfaces";

export const riderZodSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1),
  email: z.string({ required_error: "Email is required" }).email(),
  phone: z.string().optional(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  profileImage: z.string().url().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  role: z
    .enum([Role.SUPER_ADMIN, Role.ADMIN, Role.RIDER, Role.DRIVER])
    .default(Role.RIDER),
  auths: z
    .array(
      z.object({
        provider: z.string(),
        providerId: z.string(),
      })
    )
    .optional(),
  rideHistory: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  isSuspended: z.boolean().default(false),
});
