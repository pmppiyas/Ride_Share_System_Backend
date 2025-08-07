"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../../config/env");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = require("../Error/appError");
const ErrorHelperFunction_1 = require("../helper/ErrorHelperFunction");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = http_status_codes_1.default.BAD_REQUEST;
    let message = `Somethig went wrong ${err.message}`;
    if (err instanceof appError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    //Duplicate Error
    if (err?.code === 11000 || err?.errorResponse?.code === 11000) {
        const dupFunc = (0, ErrorHelperFunction_1.handleDuplicateError)(err);
        statusCode = dupFunc.statusCode;
        message = dupFunc.message;
    }
    // Zod Error
    if (err.name === "ZodError") {
        message = (0, ErrorHelperFunction_1.handleZodValidationError)(err).message;
        statusCode = http_status_codes_1.default.NOT_ACCEPTABLE;
    }
    // Validation Error
    else if (err.name === "ValidationError") {
        (0, ErrorHelperFunction_1.validationError)(err);
    }
    res.status(statusCode).json({
        success: false,
        message: message,
        err,
        stack: env_1.envVars.NODE_ENV === "development" ? err.stack : "",
    });
};
exports.globalErrorHandler = globalErrorHandler;
