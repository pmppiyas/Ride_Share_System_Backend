"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interfaces_1 = require("../user/user.interfaces");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
router.post("/logout", auth_controller_1.AuthControllers.logout);
router.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
router.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interfaces_1.Role)), auth_controller_1.AuthControllers.resetPassword);
router.get("/google", async (req, res, next) => {
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", {
        scope: [
            "profile",
            "email",
            "https://www.googleapis.com/auth/user.phonenumbers.read",
        ],
        prompt: "consent",
        state: redirect,
    })(req, res, next);
});
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), auth_controller_1.AuthControllers.googleCallback);
exports.AuthRoutes = router;
