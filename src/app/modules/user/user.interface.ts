import { Types } from "mongoose";

export enum UserRole {
  Rider = "rider",
  Driver = "driver",
  Admin = "admin",
}
export type AvailabilityStatus = "online" | "offline" | "busy";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  address?: string;
  role: UserRole;
  status?: "Active" | "Blocked";
  availability?: AvailabilityStatus;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
