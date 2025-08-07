"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = void 0;
const clearAuthCookies = (res) => {
    res.clearCookie("access-token", { secure: false, sameSite: "lax" });
    res.clearCookie("refresh-token", { secure: false, sameSite: "lax" });
};
exports.clearAuthCookies = clearAuthCookies;
