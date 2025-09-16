"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const driver_services_1 = require("./driver.services");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createDriver = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = req.user;
    const payload = req.body;
    const result = await driver_services_1.DriverServices.createDriver(user, payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Driver create request successfully",
        data: result,
    });
});
const allDriverRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await driver_services_1.DriverServices.allDriverRequest(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All requested driver retrieved successfully",
        data: result,
    });
});
const driverApproveHandle = (0, catchAsync_1.default)(async (req, res, next) => {
    const { status } = req.body;
    const result = await driver_services_1.DriverServices.driverApprovalHandle(req.params.id, status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: `Driver ${result.meta.status} successfully`,
        data: result,
    });
});
const getAllDrivers = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await driver_services_1.DriverServices.allDrivers(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All driver retrieved successfully",
        data: result,
    });
});
const getMyEarn = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await driver_services_1.DriverServices.getMyEarn(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "My earnings retrieved successfully",
        data: result,
    });
});
const getMyRideReq = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await driver_services_1.DriverServices.getMyRideReq(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "My drive request retrieved successfully",
        data: result,
    });
});
exports.DriverControllers = {
    createDriver,
    allDriverRequest,
    driverApproveHandle,
    getAllDrivers,
    getMyEarn,
    getMyRideReq,
};
