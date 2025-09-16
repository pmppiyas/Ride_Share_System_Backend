"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewAccessTokenWithRefreshToken = exports.createUserToken = void 0;
const env_1 = require("../../config/env");
const appError_1 = require("../Error/appError");
const user_interfaces_1 = require("../Modules/user/user.interfaces");
const jwt_1 = require("./jwt");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../Modules/user/user.model");
const createUserToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_TOKEN, env_1.envVars.JWT_ACCESS_EXPIRED);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRED);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserToken = createUserToken;
const createNewAccessTokenWithRefreshToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "No refreh token recived from cookies.");
    }
    const verifyRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    const isUserExist = await user_model_1.User.findOne({ email: verifyRefreshToken.email });
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
    const accessToken = (0, exports.createUserToken)(isUserExist);
    return accessToken;
};
exports.createNewAccessTokenWithRefreshToken = createNewAccessTokenWithRefreshToken;
