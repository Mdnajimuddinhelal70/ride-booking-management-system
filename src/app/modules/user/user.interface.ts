import { Types } from "mongoose";

export enum UserRole {
  Rider = "rider",
  Driver = "driver",
  Admin = "admin",
}

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
export interface IVehicleInfo {
  model?: string;
  plateNumber?: string;
  color?: string;
}

export type AvailabilityStatus = "online" | "offline" | "busy";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  oldPassword: string;
  newPassword: string;
  phoneNumber?: string;
  address?: string;
  role?: UserRole;
  auths?: IAuthProvider[];
  status?: "Active" | "Blocked";
  availability?: AvailabilityStatus;
  vehicleInfo?: IVehicleInfo;
  isBlocked?: boolean;
  authProvider?: IAuthProvider;
  createdAt?: Date;
  updatedAt?: Date;
}
