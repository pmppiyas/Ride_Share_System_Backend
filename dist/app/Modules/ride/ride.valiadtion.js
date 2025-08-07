"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideStatusSchema = exports.rideRequestSchema = void 0;
const zod_1 = require("zod");
const ride_interfaces_1 = require("./ride.interfaces");
const locationSchema = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    address: zod_1.z.string().optional(),
});
exports.rideRequestSchema = zod_1.z.object({
    pickupLocation: locationSchema,
    destinationLocation: locationSchema,
});
exports.rideStatusSchema = zod_1.z.enum([
    ride_interfaces_1.IRideStatus.REQUESTED,
    ride_interfaces_1.IRideStatus.ACCEPTED,
    ride_interfaces_1.IRideStatus.PICKED_UP,
    ride_interfaces_1.IRideStatus.IN_TRANSIT,
    ride_interfaces_1.IRideStatus.COMPLETED,
    ride_interfaces_1.IRideStatus.CANCELED,
]);
