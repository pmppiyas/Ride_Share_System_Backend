import { z } from "zod";

const IDiverApproveEnum = z.enum(["pending", "approved", "refuse"]);

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
  isAvailable: z.boolean(),
  earnings: z.number().optional(),
  approvalStatus: IDiverApproveEnum.optional(),
  rides: z.array(objectIdSchema).optional(),
});
