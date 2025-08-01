import { Types } from "mongoose";

export interface IDriver {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  licenseNumber: string;
  availability: "online" | "offline";
  totalEarnings: number;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
