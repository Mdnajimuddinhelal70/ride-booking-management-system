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
  role: UserRole;
  status?: "Active" | "Blocked";
  availability?: AvailabilityStatus;
  isBlocked?: boolean;
  authProvider?: IAuthProvider;
  createdAt?: Date;
  updatedAt?: Date;
}
