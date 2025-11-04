import { Types } from "mongoose";

export enum IRideStatus {
  REQUESTED = "requested",
  ACCEPTED = "accepted",
  PICKED_UP = "picked_up",
  IN_TRANSIT = "in_transit",

  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  destinationLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: IRideStatus;
  timestamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    canceledAt?: Date;
  };
  fare?: number;
  distance?: number;
}
