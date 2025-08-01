import { Schema, model } from "mongoose";
import { IUser, IAuths, Role, IsActive } from "./user.interfaces";
import {
  IDiverApprove,
  IDriverExtension,
  IDriverStatus,
} from "../driver/driver.interfaces";

const authSchema = new Schema<IAuths>({
  provider: { type: String, required: true },
  providerId: { type: String, required: true },
});

const UserSchema = new Schema<IUser & IDriverExtension>(
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
      lat: { type: Number },
      lng: { type: Number },
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

    // ✅ Driver-specific fields
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
    earnings: { type: Number },
    approvalStatus: {
      type: String,
      enum: Object.values(IDiverApprove),
    },
    rideStatus: {
      type: String,
      enum: Object.values(IDriverStatus),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser & IDriverExtension>("User", UserSchema);
