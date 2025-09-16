"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_model_1 = require("./user.model");
const hashingPassword_1 = require("../../utils/hashingPassword");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const appError_1 = require("../../Error/appError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUser = async (payload) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { auths, email, password, ...rest } = payload;
    let hashPassword = "";
    if (password) {
        hashPassword = await (0, hashingPassword_1.hashingPassword)(password);
    }
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = await user_model_1.User.create({
        email,
        password: hashPassword,
        auths: [authProvider],
        ...rest,
    });
    const UserObj = user.toObject();
    delete UserObj.password;
    return UserObj;
};
const getAllUser = async (query = {}) => {
    const UserSearchableFields = ["name", "phone", "email"];
    const queryBuilder = new QueryBuilder_1.QueryBuilder(user_model_1.User.find(), query)
        .filter()
        .search(UserSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        users: data,
        meta,
    };
};
const getSingleUser = async (id) => {
    const user = user_model_1.User.findById(id);
    return user;
};
const updateUser = async (id, payload) => {
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new appError_1.AppError(http_status_codes_1.default.ACCEPTED, "User not found.");
    }
    const updatedUser = user_model_1.User.findByIdAndUpdate(id, payload, {
        runValidators: true,
        new: true,
    });
    return updatedUser;
};
const deleteUser = async (id) => {
    const user = await user_model_1.User.findById(id);
    if (!user || user.isDeleted) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found or already deleted.");
    }
    user.isDeleted = true;
    await user.save();
    return deleteUser;
};
exports.UserServices = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
};
