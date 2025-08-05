import { z } from "zod";
import { IsActive, Role } from "./user.interfaces";

const locationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]).refine(
    ([lng, lat]) => {
      return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
    },
    {
      message: "Invalid coordinates range",
    }
  ),
  updatedAt: z.date().optional(),
});

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
  location: locationSchema,
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
