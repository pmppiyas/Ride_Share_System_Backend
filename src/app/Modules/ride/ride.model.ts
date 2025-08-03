import { Schema, model } from "mongoose";
import { IRideStatus } from "./ride.interfaces";
import { calculateDistance } from "../../utils/calculateDistance";

const locationSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String },
});

const rideSchema = new Schema(
  {
    rider: { type: Schema.Types.ObjectId, ref: "User" },
    driver: { type: Schema.Types.ObjectId, ref: "User" },
    pickupLocation: { type: locationSchema, _id: false },
    destinationLocation: { type: locationSchema, _id: false },
    status: {
      type: String,
      enum: Object.values(IRideStatus),
      default: IRideStatus.REQUESTED,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

rideSchema.pre("save", function (next) {
  if (
    this.pickupLocation?.lat &&
    this.pickupLocation?.lng &&
    this.destinationLocation?.lat &&
    this.destinationLocation?.lng
  ) {
    const dist = calculateDistance(
      this.pickupLocation.lat,
      this.pickupLocation.lng,
      this.destinationLocation.lat,
      this.destinationLocation.lng
    );
    this.distance = Number(dist.toFixed(2));
    this.fare = Number(Math.max(50, dist * 20).toFixed(2));
  }

  next();
});

export const Ride = model("Ride", rideSchema);
