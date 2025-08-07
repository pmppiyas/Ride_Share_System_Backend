import mongoose, { Schema, model } from "mongoose";
import { IUser, IAuths, Role, IsActive } from "./user.interfaces";
mongoose.set("strictQuery", false);

import {
  IDiverApprove,
  IDriverExtension,
  IDriverStatus,
  IDriverUser,
} from "../driver/driver.interfaces";

const authSchema = new Schema<IAuths>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
});

const UserSchema = new Schema<IDriverUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, index: true },
    password: {
      type: String,
      required: function () {
        return !this.auths?.length;
      },
    },
    profileImage: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.RIDER,
      required: true,
    },
    auths: {
      type: [authSchema],
      required: true,
      _id: false,
    },

    rideHistory: [{ type: Schema.Types.ObjectId, ref: "Ride", default: [] }],

    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    //  Driver-specific fields
    licenseNumber: { type: String, required: false },
    vehicleInfo: {
      type: {
        type: String,
        enum: ["car", "bike"],
      },
      model: String,
      plateNumber: String,
    },
    isAvailable: { type: Boolean },
    isOnline: { type: Boolean },
    earnings: { type: Number },
    approvalStatus: {
      type: String,
      enum: Object.values(IDiverApprove),
    },
    rideStatus: {
      type: String,
      enum: Object.values(IDriverStatus),
    },
    driveRides: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IDriverUser>("User", UserSchema);

UserSchema.pre("save", function (next) {
  if (this.role !== Role.DRIVER) {
    delete this.driveRides;
    delete this.licenseNumber;
    delete this.vehicleInfo;
    delete this.isAvailable;
    delete this.earnings;
    delete this.approvalStatus;
    delete this.rideStatus;
    delete this.isOnline;
  }

  next();
});

UserSchema.index({ location: "2dsphere" });
