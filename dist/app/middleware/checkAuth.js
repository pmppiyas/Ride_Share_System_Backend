"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const env_1 = require("../../config/env");
const appError_1 = require("../Error/appError");
const jwt_1 = require("../utils/jwt");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../Modules/user/user.model");
const user_interfaces_1 = require("../Modules/user/user.interfaces");
const checkAuth = (...authRoles) => {
    return async (req, res, next) => {
        try {
            const accessToken = env_1.envVars.NODE_ENV === "development"
                ? req.headers.authorization
                : req.cookies["access-token"];
            if (!accessToken) {
                throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "No Token Received");
            }
            const verifiedToken = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_TOKEN);
            if (!authRoles.includes(verifiedToken.role)) {
                throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "You are not permitted for this route");
            }
            const isUserExist = await user_model_1.User.findOne({ _id: verifiedToken.userId });
            if (!isUserExist) {
                throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
            }
            if (isUserExist.isActive === user_interfaces_1.IsActive.BLOCK ||
                isUserExist.isActive === user_interfaces_1.IsActive.INACTIVE) {
                throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExist.isActive}`);
            }
            if (isUserExist.isDeleted) {
                throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
            }
            req.user = verifiedToken;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.checkAuth = checkAuth;
