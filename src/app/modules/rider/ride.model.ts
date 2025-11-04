import { Schema, model } from "mongoose";
import { IRide } from "./ride.interface";

const rideSchema = new Schema<IRide>(
  {
    pickupLocation: { type: String, required: true },
    destinationLocation: { type: String, required: true },

    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "picked_up",
        "in_transit",
        "completed",
        "cancelled",
        "rejected",
        "pending",
      ],
      default: "requested",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "requested",
            "accepted",
            "picked_up",
            "in_transit",
            "completed",
            "cancelled",
            "rejected",
            "pending",
          ],
        },
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ridePrice: { type: Number, default: 0 },
    riderEmail: {
      type: String,
      required: true,
    },
    driverId: { type: Schema.Types.ObjectId, ref: "User", default: null },

    requestedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ride = model<IRide>("Ride", rideSchema);
