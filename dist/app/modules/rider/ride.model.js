"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const rideSchema = new mongoose_1.Schema({
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
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    ridePrice: { type: Number, default: 0 },
    riderEmail: {
        type: String,
        required: true,
    },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    requestedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
