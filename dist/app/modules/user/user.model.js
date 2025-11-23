"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const userSchema = new mongoose_1.Schema({
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
        enum: Object.values(user_interface_1.UserRole),
        default: user_interface_1.UserRole.Rider,
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
    vehicleInfo: {
        model: { type: String },
        plateNumber: { type: String },
        color: { type: String },
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
