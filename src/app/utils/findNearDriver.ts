import {
  IDiverApprove,
  IDriverStatus,
} from "../Modules/driver/driver.interfaces";
import { User } from "../Modules/user/user.model";

export const findNearbyDriver = async (
  pickupLat: number,
  pickupLng: number
) => {
  const radiusInKM = 10;

  const nearbyDriver = await User.find({
    role: "DRIVER",
    approvalStatus: IDiverApprove.APPROVED,
    rideStatus: IDriverStatus.IDLE,
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
