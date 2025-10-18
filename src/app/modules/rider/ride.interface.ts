import { Types } from "mongoose";

export type RideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled"
  | "rejected"
  | "pending";

export interface IStatusHistory {
  status: RideStatus;
  updatedAt: Date;
}

export interface IRide {
  pickupLocation: string;
  destinationLocation: string;
  status: RideStatus;

  statusHistory?: IStatusHistory[];

  ridePrice: number;
  riderEmail: string;

  riderId: Types.ObjectId;
  driverId?: Types.ObjectId | string | null;

  requestedAt: Date;
  updatedAt?: Date;
}
