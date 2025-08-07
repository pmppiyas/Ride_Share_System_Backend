"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSUperAdmin = void 0;
/* eslint-disable no-console */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const user_interfaces_1 = require("../Modules/user/user.interfaces");
const user_model_1 = require("../Modules/user/user.model");
const seedSUperAdmin = async () => {
    try {
        const isSuperAdminExist = await user_model_1.User.findOne({
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
        });
        if (isSuperAdminExist) {
            console.log("Super Admin \n", isSuperAdminExist);
            return;
        }
        console.log("Trying to create super admin");
        const hashPassword = await bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASSWORD, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const authProvider = {
            provider: "credentials",
            providerId: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const payload = {
            name: "Super Admin",
            role: user_interfaces_1.Role.SUPER_ADMIN,
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            password: hashPassword,
            auths: [authProvider],
            isActive: user_interfaces_1.IsActive.ACTIVE,
            isDeleted: false,
            isVerified: true,
            location: {
                type: "Point",
                coordinates: [89.25, 25.75],
                updatedAt: new Date(),
            },
        };
        const superAdmin = await user_model_1.User.create(payload);
        console.log("Super Admin Created Successfully! \n");
        console.log(superAdmin);
    }
    catch (error) {
        console.log(error);
    }
};
exports.seedSUperAdmin = seedSUperAdmin;
