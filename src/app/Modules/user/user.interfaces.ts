import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  RIDER = "Rider",
  DRIVER = "DRIVER",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCK = "BLOCK",
}

export interface IAuths {
  provider: string;
  providerId: string;
}

export interface IUser {
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
  isActive: IsActive;
  isVerified: boolean;
  isDeleted: boolean;
}
