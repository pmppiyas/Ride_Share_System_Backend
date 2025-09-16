"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashingPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("./../../config/env");
const hashingPassword = async (password) => {
    const saltRound = Number(env_1.envVars.BCRYPT_SALT_ROUND);
    return await bcryptjs_1.default.hash(password, saltRound);
};
exports.hashingPassword = hashingPassword;
