"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideServices = void 0;
const findNearDriver_1 = require("../../utils/findNearDriver");
const ride_model_1 = require("./ride.model");
const ride_interfaces_1 = require("./ride.interfaces");
const appError_1 = require("../../Error/appError");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const driver_interfaces_1 = require("../driver/driver.interfaces");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const user_interfaces_1 = require("../user/user.interfaces");
const findDriver = async (payload) => {
    const driver = await (0, findNearDriver_1.findNearbyDriver)(payload.pickupLocation.lat, payload.pickupLocation.lng);
    if (!driver || driver.length === 0) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "No available driver nearby");
    }
    const meta = driver.length;
    return {
        driver,
        meta,
    };
};
const createRide = async (decodedToken, payload, driverId) => {
    if (!decodedToken) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "No decodedToken ");
    }
    const rider = await user_model_1.User.findById(decodedToken.userId);
    if (!rider) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Rider not found");
    }
    const requestedRide = await ride_model_1.Ride.findOne({
        rider: rider._id,
        status: ride_interfaces_1.IRideStatus.REQUESTED,
    });
    if (requestedRide) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "You already have an requested ride, Please cancel it first.", `Ride ID: ${requestedRide._id}`);
    }
    const activeRide = await ride_model_1.Ride.findOne({
        rider: rider._id,
        status: {
            $nin: [ride_interfaces_1.IRideStatus.COMPLETED, ride_interfaces_1.IRideStatus.CANCELED],
        },
    });
    if (activeRide) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, "You already have an ongoing ride");
    }
    console.log(driverId);
    const cleanId = driverId.trim();
    const driver = await user_model_1.User.findById({ _id: cleanId });
    console.log(cleanId, driver);
    // if (!driver) throw new AppError(httpStatus.NOT_FOUND + 1, "Driver Missing");
    const ride = new ride_model_1.Ride({
        rider: decodedToken.userId,
        driver: cleanId,
        pickupLocation: payload.pickupLocation,
        destinationLocation: payload.destinationLocation,
        status: ride_interfaces_1.IRideStatus.REQUESTED,
        timestamps: {
            requestedAt: new Date(),
        },
    });
    await ride.save();
    await user_model_1.User.findByIdAndUpdate(decodedToken.userId, {
        $addToSet: { rideHistory: ride._id },
    });
    await user_model_1.User.findByIdAndUpdate(ride.driver, {
        $addToSet: { driveRides: ride._id },
    });
    if (driver) {
        driver.isAvailable = false;
        await driver.save();
    }
    return ride;
};
const setRideStatus = async (rideId, action, decodedToken) => {
    console.log(rideId);
    const ride = await ride_model_1.Ride.findById(rideId)
        .populate("rider", "-_id name phone")
        .populate("driver", "-_id name phone rideStatus");
    if (!ride || !ride.driver || !ride.rider) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Ride not found.");
    }
    console.log(action);
    if (!Object.values(ride_interfaces_1.IRideStatus).includes(action)) {
        throw new appError_1.AppError(http_status_codes_1.default.EXPECTATION_FAILED, "Invalid ride status");
    }
    const riderAllowedStatuses = [ride_interfaces_1.IRideStatus.COMPLETED, ride_interfaces_1.IRideStatus.CANCELED];
    const driverAllowedStatuses = Object.values(ride_interfaces_1.IRideStatus);
    const allowedStatuses = decodedToken.role === user_interfaces_1.Role.DRIVER
        ? driverAllowedStatuses
        : riderAllowedStatuses;
    if (!allowedStatuses.includes(action)) {
        throw new appError_1.AppError(http_status_codes_1.default.FORBIDDEN, `You are not allowed to set status to ${action}. Only Driver can do this.`);
    }
    const irreversibleStatuses = [
        ride_interfaces_1.IRideStatus.PICKED_UP,
        ride_interfaces_1.IRideStatus.IN_TRANSIT,
        ride_interfaces_1.IRideStatus.COMPLETED,
        ride_interfaces_1.IRideStatus.CANCELED,
    ];
    if (action === ride_interfaces_1.IRideStatus.CANCELED &&
        irreversibleStatuses.includes(ride.status) &&
        decodedToken.role !== user_interfaces_1.Role.DRIVER) {
        throw new appError_1.AppError(http_status_codes_1.default.BAD_REQUEST, `Cannot cancel a ride that is already ${ride.status}`);
    }
    if (ride.status == ride_interfaces_1.IRideStatus.COMPLETED) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_ACCEPTABLE, "This ride is already completed.");
    }
    ride.status = action;
    if (!ride.timestamps) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Unable to find timestamps");
    }
    if (!ride.driver) {
        throw new appError_1.AppError(http_status_codes_1.default.NOT_FOUND, "Driver ID Not Found.");
    }
    switch (action) {
        case ride_interfaces_1.IRideStatus.ACCEPTED:
            ride.timestamps.acceptedAt = new Date();
            await user_model_1.User.findByIdAndUpdate(ride.driver._id, {
                isAvailable: false,
                rideStatus: driver_interfaces_1.IDriverStatus.ACCEPTED,
            });
            break;
        case ride_interfaces_1.IRideStatus.PICKED_UP:
            ride.timestamps.pickedUpAt = new Date();
            await user_model_1.User.findByIdAndUpdate(ride.driver._id, {
                isAvailable: false,
                rideStatus: driver_interfaces_1.IDriverStatus.PICKEDUP,
            });
            break;
        case ride_interfaces_1.IRideStatus.IN_TRANSIT:
            await user_model_1.User.findByIdAndUpdate(ride.driver._id, {
                isAvailable: false,
                rideStatus: driver_interfaces_1.IDriverStatus.INTRANSIT,
            });
            break;
        case ride_interfaces_1.IRideStatus.COMPLETED:
            ride.timestamps.completedAt = new Date();
            await user_model_1.User.findByIdAndUpdate(ride.driver._id, {
                $inc: { earnings: ride.fare ?? 0 },
                isAvailable: true,
                rideStatus: driver_interfaces_1.IDriverStatus.COMPLETED,
            });
            break;
        case ride_interfaces_1.IRideStatus.CANCELED:
            ride.timestamps.canceledAt = new Date();
            await user_model_1.User.findByIdAndUpdate(ride.driver._id, {
                isAvailable: true,
                rideStatus: driver_interfaces_1.IDriverStatus.IDLE,
            });
            break;
    }
    await ride.save();
    return ride;
};
const getAllRides = async (query = {}) => {
    const rideSearchableFields = [
        "status",
        "pickupLocation.address",
        "destinationLocation.address",
    ];
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query)
        .filter()
        .search(rideSearchableFields)
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        queryBuilder.build([
            { path: "driver", select: "-_id name phone" },
            { path: "rider", select: "-_id name phone" },
        ]),
        queryBuilder.getMeta(),
    ]);
    return {
        rides: data,
        meta,
    };
};
const getSingleRide = async (id) => {
    return ride_model_1.Ride.findById(id)
        .populate("driver", "-_id name phone")
        .populate("rider", "-_id name phone");
};
const getMyRide = async (decodedToken) => {
    const myRides = await ride_model_1.Ride.find({ rider: decodedToken.userId })
        .populate("driver", "name phone -_id")
        .populate("rider", "name phone -_id");
    const docCount = await ride_model_1.Ride.countDocuments({ rider: decodedToken.userId });
    return {
        rides: myRides,
        meta: {
            count: docCount,
        },
    };
};
const getMyDrive = async (decodedToken) => {
    const myRides = await ride_model_1.Ride.find({ driver: decodedToken.userId })
        .populate("driver", "name phone -_id")
        .populate("rider", "name phone -_id");
    const docCount = await ride_model_1.Ride.countDocuments({ rider: decodedToken.userId });
    return {
        rides: myRides,
        meta: {
            count: docCount,
        },
    };
};
exports.RideServices = {
    findDriver,
    createRide,
    setRideStatus,
    getAllRides,
    getSingleRide,
    getMyRide,
    getMyDrive,
};
