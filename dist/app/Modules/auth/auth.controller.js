"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = require("../../Error/appError");
const env_1 = require("../../../config/env");
const passport_1 = __importDefault(require("passport"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const userToken_1 = require("../../utils/userToken");
const setCookie_1 = require("../../utils/setCookie");
const clearCookie_1 = require("../../utils/clearCookie");
const auth_services_1 = require("./auth.services");
const credentialsLogin = (0, catchAsync_1.default)(async (req, res, next) => {
    passport_1.default.authenticate("local", async (err, user, info) => {
        if (err) {
            return next(new appError_1.AppError(http_status_codes_1.default.METHOD_FAILURE, err));
        }
        if (!user) {
            return next(new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, info.message));
        }
        const userToken = (0, userToken_1.createUserToken)(user);
        (0, setCookie_1.setAuthCookie)(res, userToken);
        const { password: _password, ...rest } = user.toObject();
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "User Login Successfully",
            data: {
                accessToken: userToken.accessToken,
                refreshToken: userToken.refreshToken,
                user: rest,
            },
        });
    })(req, res, next);
});
const getMe = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = req.user;
    const userId = user?.userId;
    const data = await auth_services_1.AuthServices.getMe(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Self get Successfully",
        data: data,
    });
});
const logout = (0, catchAsync_1.default)(async (req, res, next) => {
    (0, clearCookie_1.clearAuthCookies)(res);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Logout successfully",
        data: null,
    });
});
const getNewAccessToken = (0, catchAsync_1.default)(async (req, res, next) => {
    const refreshToken = req.cookies["refresh-token"];
    const tokenInfo = await auth_services_1.AuthServices.getNewAccessToken(refreshToken);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "New Token Genarete Successfully",
        data: tokenInfo,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    await auth_services_1.AuthServices.resetPassword(oldPassword, newPassword, decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Password reset successfully",
        data: null,
    });
});
const googleCallback = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = req.user;
    if (!user) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const tokenInfo = await (0, userToken_1.createUserToken)(user);
    console.log(tokenInfo);
    (0, setCookie_1.setAuthCookie)(res, tokenInfo);
    let redirectTo = req.query?.state && typeof req.query.state === "string"
        ? req.query.state.replace(/^\//, "")
        : "dashboard";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    if (req.query.json === "true") {
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Google login successfully",
            data: tokenInfo,
        });
    }
    res.redirect(`${env_1.envVars.FRONTEND_URL1}/${redirectTo}`);
});
exports.AuthControllers = {
    googleCallback,
    getMe,
    credentialsLogin,
    logout,
    getNewAccessToken,
    resetPassword,
};
