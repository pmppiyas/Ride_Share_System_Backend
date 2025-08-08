"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverServices = void 0;
// src/app/modules/driver/driver.services.ts
const user_model_1 = require("../user/user.model");
const mongoose_1 = require("mongoose");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_interfaces_1 = require("./driver.interfaces");
const user_interfaces_1 = require("../user/user.interfaces");
const appError_1 = require("../../Error/appError");
const ride_model_1 = require("../ride/ride.model");
const createDriver = async (decodedToken, payload) => {
    if (!mongoose_1.Types.ObjectId.isValid(decodedToken.userId)) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_ACCEPTABLE, "Invalid user ID");
    }
    const user = await user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.role === user_interfaces_1.Role.DRIVER &&
        user.approvalStatus === driver_interfaces_1.IDiverApprove.PENDING) {
        throw new appError_1.AppError(http_status_codes_1.default.CONFLICT, "Your request is already pending. Please wait few workdays");
    }
    if (user.role === user_interfaces_1.Role.DRIVER &&
        user.approvalStatus === driver_interfaces_1.IDiverApprove.APPROVED) {
        throw new appError_1.AppError(http_status_codes_1.default.CONFLICT, "You are already a driver.");
    }
    user.role = user_interfaces_1.Role.DRIVER;
    user.licenseNumber = payload.licenseNumber;
    user.vehicleInfo = payload.vehicleInfo;
    user.isAvailable = true;
    user.isOnline = true;
    user.earnings = payload.earnings ?? 0;
    user.approvalStatus = driver_interfaces_1.IDiverApprove.PENDING;
    user.rideStatus = driver_interfaces_1.IDriverStatus.IDLE;
    await user.save();
    return user;
};
const allDriverRequest = async () => {
    const result = await user_model_1.User.find({
        role: user_interfaces_1.Role.DRIVER,
        approvalStatus: driver_interfaces_1.IDiverApprove.PENDING,
    });
    const countDoc = await result.length;
    return {
        data: result,
        meta: {
            total: countDoc,
        },
    };
};
const driverApprovalHandle = async (id, status) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_ACCEPTABLE, "Invalid user ID");
    }
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_ACCEPTABLE, "User is not found.");
    }
    const isDriver = user.role == user_interfaces_1.Role.DRIVER;
    if (!isDriver) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_ACCEPTABLE, "User is not a driver.");
    }
    if (!status || !Object.values(driver_interfaces_1.IDiverApprove).includes(status)) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_ACCEPTABLE, "Please provide a valid status (pending / approved/ refuse/ suspend).");
    }
    const result = await user_model_1.User.findByIdAndUpdate(id, { approvalStatus: status }, { new: true, runValidators: true });
    return {
        data: result,
        meta: {
            status: status,
        },
    };
};
const allDrivers = async () => {
    const allDrivers = await user_model_1.User.find({
        role: user_interfaces_1.Role.DRIVER,
        approvalStatus: driver_interfaces_1.IDiverApprove.APPROVED,
    });
    return {
        data: allDrivers,
        meta: {
            total: await allDrivers.length,
        },
    };
};
const getMyEarn = async (decodedToken) => {
    const driver = await user_model_1.User.findById(decodedToken.userId);
    if (!driver ||
        driver.role !== user_interfaces_1.Role.DRIVER ||
        driver.approvalStatus !== driver_interfaces_1.IDiverApprove.APPROVED) {
        throw new Error("Unauthorized or driver not approved");
    }
    const totalEarnings = driver.earnings || 0;
    return {
        data: driver,
        meta: {
            totalEarnings,
        },
    };
};
const getMyRideReq = async (decodedToken) => {
    const driverId = decodedToken.userId;
    const rides = await ride_model_1.Ride.find({ driver: driverId }).sort({ createdAt: -1 });
    return {
        data: rides,
        meta: rides.length,
    };
};
exports.DriverServices = {
    createDriver,
    allDriverRequest,
    driverApprovalHandle,
    allDrivers,
    getMyEarn,
    getMyRideReq,
};
