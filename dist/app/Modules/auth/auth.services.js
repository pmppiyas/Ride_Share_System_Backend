"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const appError_1 = require("../../Error/appError");
const userToken_1 = require("../../utils/userToken");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashingPassword_1 = require("../../utils/hashingPassword");
const getNewAccessToken = async (refreshToken) => {
    const newAccessToken = await (0, userToken_1.createNewAccessTokenWithRefreshToken)(refreshToken);
    return newAccessToken;
};
const resetPassword = async (oldPassword, newPassword, decodedToken) => {
    if (!oldPassword) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Give Old Password as (oldPassword)");
    }
    if (!newPassword) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Give New Password as (newPassword)");
    }
    const user = await user_model_1.User.findById(decodedToken.userId);
    if (!user || !user.password) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "User not found or password missing");
    }
    if (oldPassword === newPassword) {
        throw new appError_1.AppError(http_status_codes_1.default.METHOD_FAILURE, "Please give defferent new password");
    }
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isOldPasswordMatch) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Incorrect old password");
    }
    user.password = await (0, hashingPassword_1.hashingPassword)(newPassword);
    await user.save();
    return true;
};
exports.AuthServices = {
    getNewAccessToken,
    resetPassword,
};
