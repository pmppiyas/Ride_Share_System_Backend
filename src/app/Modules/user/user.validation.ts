import { z } from "zod";
import { IsActive, Role } from "./user.interfaces";

export const UserZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Please enter a valid email address",
    }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^()_\-])[A-Za-z\d@$!%*?#&^()_\-]{6,}$/,
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }
    ),
  phone: z.string().regex(/^01[3-9]\d{8}$/, {
    message: "Invalid Bangladeshi phone number",
  }),

  profileImage: z.string().optional(),
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
  isActive: z.string().default(IsActive.ACTIVE),
  isVerified: z.boolean().default(false),
});
