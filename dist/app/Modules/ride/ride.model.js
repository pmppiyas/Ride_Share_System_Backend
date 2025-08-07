"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interfaces_1 = require("./ride.interfaces");
const calculateDistance_1 = require("../../utils/calculateDistance");
const locationSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
});
const rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    pickupLocation: { type: locationSchema, _id: false },
    destinationLocation: { type: locationSchema, _id: false },
    status: {
        type: String,
        enum: Object.values(ride_interfaces_1.IRideStatus),
        default: ride_interfaces_1.IRideStatus.REQUESTED,
    },
    timestamps: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: Date,
        pickedUpAt: Date,
        completedAt: Date,
        canceledAt: Date,
    },
    fare: Number,
    distance: Number,
}, {
    timestamps: true,
    versionKey: false,
});
rideSchema.pre("save", function (next) {
    if (this.pickupLocation?.lat &&
        this.pickupLocation?.lng &&
        this.destinationLocation?.lat &&
        this.destinationLocation?.lng) {
        const dist = (0, calculateDistance_1.calculateDistance)(this.pickupLocation.lat, this.pickupLocation.lng, this.destinationLocation.lat, this.destinationLocation.lng);
        this.distance = Number(dist.toFixed(2));
        this.fare = Number(Math.max(50, dist * 20).toFixed(2));
    }
    next();
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
