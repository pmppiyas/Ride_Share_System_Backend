"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVars = () => {
    const requiredEnvVars = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "EXPRESS_SESSION_SECRET",
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET",
        "GOOGLE_CALLBACK_URL",
        "FRONTEND_URL",
        "JWT_ACCESS_TOKEN",
        "JWT_ACCESS_EXPIRED",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRED",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
    ];
    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        JWT_ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN,
        JWT_ACCESS_EXPIRED: process.env.JWT_ACCESS_EXPIRED,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    };
};
exports.envVars = loadEnvVars();
