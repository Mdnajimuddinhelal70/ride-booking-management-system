import { Schema, model } from "mongoose";
import { IUser, UserRole } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Rider,
    },
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
    isBlocked: { type: Boolean, default: false },
    phoneNumber: { type: String },
    address: { type: String },
    availability: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "online",
    },
    authProvider: {
      provider: {
        type: String,
        enum: ["google", "credentials"],
        default: "credentials",
      },
      providerId: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
