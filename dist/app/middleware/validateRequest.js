"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const appError_1 = require("../Error/appError");
const validateRequest = (ZodSchema) => async (req, res, next) => {
    try {
        req.body = await ZodSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        throw new appError_1.AppError(400, "Object is undefined or not valid");
        next(error);
    }
};
exports.validateRequest = validateRequest;
