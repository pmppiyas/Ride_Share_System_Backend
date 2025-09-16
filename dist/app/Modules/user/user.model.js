"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_interfaces_1 = require("./user.interfaces");
mongoose_1.default.set("strictQuery", false);
const driver_interfaces_1 = require("../driver/driver.interfaces");
const authSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
});
const UserSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: () => new mongoose_1.default.Types.ObjectId(),
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
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
            required: false,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    role: {
        type: String,
        enum: Object.values(user_interfaces_1.Role),
        default: user_interfaces_1.Role.RIDER,
        required: true,
    },
    auths: {
        type: [authSchema],
        required: true,
        _id: false,
    },
    rideHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Ride", default: [] }],
    isActive: {
        type: String,
        enum: Object.values(user_interfaces_1.IsActive),
        default: user_interfaces_1.IsActive.ACTIVE,
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
        enum: Object.values(driver_interfaces_1.IDiverApprove),
    },
    rideStatus: {
        type: String,
        enum: Object.values(driver_interfaces_1.IDriverStatus),
    },
    driveRides: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Ride",
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
UserSchema.pre("save", function (next) {
    if (this.role !== user_interfaces_1.Role.DRIVER) {
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
