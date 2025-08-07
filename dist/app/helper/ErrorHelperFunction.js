"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationError = exports.handleZodValidationError = exports.handleDuplicateError = exports.errorSources = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
exports.errorSources = [];
let errMode = [];
let missing = [];
const resetState = () => {
    exports.errorSources = [];
    errMode = [];
    missing = [];
};
const handleDuplicateError = (err) => {
    resetState();
    const keyValue = err.keyValue;
    if (keyValue) {
        const field = Object.keys(keyValue)[0];
        const value = keyValue[field];
        return {
            message: `Duplicate ${field} "${value}" already exists`,
            statusCode: http_status_codes_1.default.METHOD_FAILURE,
        };
    }
    return {
        message: "Duplicate value already exists",
        statusCode: http_status_codes_1.default.METHOD_FAILURE,
    };
};
exports.handleDuplicateError = handleDuplicateError;
const handleZodValidationError = (err) => {
    resetState();
    if (!err || !err.errors || typeof err.errors !== "object") {
        return {
            message: err?.issues?.[0]?.message || "Zod validation failed",
            statusCode: http_status_codes_1.default.BAD_REQUEST,
        };
    }
    const errors = Object.values(err.errors);
    errors.forEach((errObj) => {
        const path = Array.isArray(errObj.path) ? errObj.path[0] : errObj.path;
        exports.errorSources.push({
            path: path,
            message: errObj.message,
        });
        if (path) {
            missing.push(path);
        }
        errMode.push(errObj);
    });
    const capitalizedFields = missing
        .map((item) => item ? item.charAt(0).toUpperCase() + item.slice(1) : "Field")
        .join(", ");
    const prefix = errMode[0]?.received === "undefined"
        ? "Missing required field"
        : "Wrong value in";
    return {
        message: `${prefix}: ${capitalizedFields}`,
        statusCode: http_status_codes_1.default.BAD_REQUEST,
    };
};
exports.handleZodValidationError = handleZodValidationError;
const validationError = (err) => {
    resetState();
    const errors = Object.values(err.errors || {});
    const formattedErrors = [];
    errors.forEach((errObj) => {
        formattedErrors.push({
            path: errObj.path,
            message: errObj.message,
        });
        exports.errorSources.push({
            path: errObj.path,
            message: errObj.message,
        });
    });
    const missingFields = formattedErrors.map((e) => e.path).join(", ");
    const messages = formattedErrors.map((e) => e.message).join(" | ");
    return {
        message: `Validation failed on: ${missingFields} → ${messages}`,
        statusCode: http_status_codes_1.default.BAD_REQUEST,
    };
};
exports.validationError = validationError;
