"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserZodSchema = void 0;
const zod_1 = require("zod");
const user_interfaces_1 = require("./user.interfaces");
const locationSchema = zod_1.z.object({
    type: zod_1.z.literal("Point"),
    coordinates: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number()]).refine(([lng, lat]) => {
        return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
    }, {
        message: "Invalid coordinates range",
    }),
    updatedAt: zod_1.z.date().optional(),
});
exports.UserZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name is required" }),
    email: zod_1.z
        .string()
        .min(1, { message: "Email is required" })
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message: "Please enter a valid email address",
    }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&^()_])[A-Za-z\d@$!%*?#&^()_]{6,}$/, {
        message: "Password must include uppercase, lowercase, number, and special character",
    }),
    phone: zod_1.z.string().regex(/^01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    }),
    profileImage: zod_1.z.string().optional(),
    location: locationSchema,
    role: zod_1.z
        .enum([user_interfaces_1.Role.SUPER_ADMIN, user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.RIDER, user_interfaces_1.Role.DRIVER])
        .default(user_interfaces_1.Role.RIDER),
    auths: zod_1.z
        .array(zod_1.z.object({
        provider: zod_1.z.string(),
        providerId: zod_1.z.string(),
    }))
        .optional(),
    rideHistory: zod_1.z.array(zod_1.z.string()).optional(),
    isActive: zod_1.z.string().default(user_interfaces_1.IsActive.ACTIVE),
    isVerified: zod_1.z.boolean().default(false),
});
