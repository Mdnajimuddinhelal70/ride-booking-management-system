import { Schema, model } from "mongoose";
import { IDriver } from "./driver.interface";

const driverSchema = new Schema<IDriver>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Driver = model<IDriver>("Driver", driverSchema);
