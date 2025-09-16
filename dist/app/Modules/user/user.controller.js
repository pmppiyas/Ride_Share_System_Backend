"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_services_1 = require("./user.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUser = (0, catchAsync_1.default)(async (req, res, next) => {
    console.log(req.body);
    const User = await user_services_1.UserServices.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User create successfully",
        data: User,
    });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await user_services_1.UserServices.getAllUser(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All User retrieved successfully",
        data: result,
    });
});
const getSingleUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await user_services_1.UserServices.getSingleUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Get single user successfully",
        data: result,
    });
});
const updateUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const User = await user_services_1.UserServices.updateUser(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User updated successfully",
        data: User,
    });
});
const deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const User = await user_services_1.UserServices.deleteUser(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "User deleted successfully",
        data: User,
    });
});
exports.UserController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
