import { Schema, model } from "mongoose";
import { IRider, Role } from "./rider.interfaces";

const riderSchema = new Schema<IRider>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    profileImage: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.RIDER,
      required: true,
    },
    rideHistory: [{ type: Schema.Types.ObjectId, ref: "Ride" }],
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Rider = model<IRider>("Rider", riderSchema);
