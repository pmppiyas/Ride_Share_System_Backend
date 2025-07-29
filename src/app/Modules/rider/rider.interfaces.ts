import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "RIDER",
  DRIVER = "DRIVER",
}

export interface IAuths {
  provider: string;
  providerId: string;
}

export interface IRider {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  profileImage?: string;
  location?: {
    lat: number;
    lng: number;
  };
  role: Role;
  auths: IAuths[];
  rideHistory?: Types.ObjectId[];
  isActive: boolean;
  isVerified: boolean;
  isSuspended: boolean;
}
