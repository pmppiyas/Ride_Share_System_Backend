"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const ride_services_1 = require("./ride.services");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ride_valiadtion_1 = require("./ride.valiadtion");
const appError_1 = require("../../Error/appError");
const findDriver = (0, catchAsync_1.default)(async (req, res, next) => {
    const drivers = await ride_services_1.RideServices.findDriver(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Driver found successfully",
        data: drivers,
    });
});
const createRide = (0, catchAsync_1.default)(async (req, res, next) => {
    const driverId = req.params.id;
    const ride = await ride_services_1.RideServices.createRide(req.user, req.body, driverId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Ride create successfully",
        data: ride,
    });
});
const setRideStatus = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = ride_valiadtion_1.rideStatusSchema.safeParse(req.body.status);
    if (!result.success) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "Invalid ride status");
    }
    const setStatus = await ride_services_1.RideServices.setRideStatus(req.params.id, req.body.status, req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: `Ride ${req.params.id} successfully`,
        data: setStatus,
    });
});
const getAllRides = (0, catchAsync_1.default)(async (req, res, next) => {
    const rides = await ride_services_1.RideServices.getAllRides(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: `All rides retrieved successfully`,
        data: rides,
    });
});
const getSingleRides = (0, catchAsync_1.default)(async (req, res, next) => {
    const rides = await ride_services_1.RideServices.getSingleRide(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: `Single ride retrieved successfully`,
        data: rides,
    });
});
const getmyRides = (0, catchAsync_1.default)(async (req, res, next) => {
    const decodedToken = req.user;
    const myRides = await ride_services_1.RideServices.getMyRide(decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your all rides retrieved successfully.",
        data: myRides,
    });
});
const getmyDrives = (0, catchAsync_1.default)(async (req, res, next) => {
    const decodedToken = req.user;
    const myRides = await ride_services_1.RideServices.getMyDrive(decodedToken);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Your all drive retrieved successfully.",
        data: myRides,
    });
});
exports.RideControllers = {
    findDriver,
    createRide,
    setRideStatus,
    getAllRides,
    getSingleRides,
    getmyRides,
    getmyDrives,
};
