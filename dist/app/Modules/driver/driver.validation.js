"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverExtensionSchema = void 0;
const zod_1 = require("zod");
const IDiverApproveEnum = zod_1.z.enum(["pending", "approved", "refuse", "suspend"]);
const vehicleInfoSchema = zod_1.z.object({
    type: zod_1.z.enum(["car", "bike"]),
    model: zod_1.z.string().min(1),
    plateNumber: zod_1.z.string().min(1),
});
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
exports.driverExtensionSchema = zod_1.z.object({
    licenseNumber: zod_1.z.string().min(1),
    vehicleInfo: vehicleInfoSchema,
    isAvailable: zod_1.z.boolean().optional(),
    isOnline: zod_1.z.boolean().optional(),
    earnings: zod_1.z.number().optional(),
    approvalStatus: IDiverApproveEnum.optional(),
    driveRides: zod_1.z.array(objectIdSchema).optional(),
});
