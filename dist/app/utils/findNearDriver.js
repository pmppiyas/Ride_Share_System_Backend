"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNearbyDriver = void 0;
const driver_interfaces_1 = require("../Modules/driver/driver.interfaces");
const user_model_1 = require("../Modules/user/user.model");
const findNearbyDriver = async (pickupLat, pickupLng) => {
    const radiusInKM = 10;
    const nearbyDriver = await user_model_1.User.find({
        role: "DRIVER",
        approvalStatus: driver_interfaces_1.IDiverApprove.APPROVED,
        rideStatus: driver_interfaces_1.IDriverStatus.IDLE,
        isAvailable: true,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [pickupLng, pickupLat],
                },
                $maxDistance: radiusInKM * 1000,
            },
        },
    }).limit(5);
    return nearbyDriver;
};
exports.findNearbyDriver = findNearbyDriver;
