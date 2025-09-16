import { z } from "zod";

const IDiverApproveEnum = z.enum(["pending", "approved", "refuse", "suspend"]);

const vehicleInfoSchema = z.object({
  type: z.enum(["car", "bike"]),
  model: z.string().min(1),
  plateNumber: z.string().min(1),
});

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const driverExtensionSchema = z.object({
  licenseNumber: z.string().min(1),
  vehicleInfo: vehicleInfoSchema,
  isAvailable: z.boolean().optional(),
  isOnline: z.boolean().optional(),
  earnings: z.number().optional(),
  approvalStatus: IDiverApproveEnum.optional(),
  driveRides: z.array(objectIdSchema).optional(),
});
