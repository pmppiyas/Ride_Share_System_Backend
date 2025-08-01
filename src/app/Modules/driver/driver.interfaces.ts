import { IUser } from "../user/user.interfaces";

export interface IVehicleInfo {
  type: "car" | "bike";
  model: string;
  plateNumber: string;
}

export enum IDiverApprove {
  PENDING = "pending",
  APPROVED = "approved",
  REFUSE = "refuse",
}

export enum IDriverStatus {
  IDLE = "idle",
  PICKEDUP = "picked_up",
  INTRANSIT = "in_transit",
  COMPLETED = "completed",
}

export interface IDriverExtension {
  licenseNumber: string;
  vehicleInfo: IVehicleInfo;
  isAvailable: boolean;
  earnings?: number;
  approvalStatus?: IDiverApprove;
  rideStatus: IDriverStatus;
}

export type IDriverUser = IUser & IDriverExtension;
