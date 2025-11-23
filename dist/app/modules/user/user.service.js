"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("./user.model");
// const createUser = async (payload: Partial<IUser>) => {
//   const { email, password, ...rest } = payload;
//   const isUserExists = await User.findOne({ email });
//   if (isUserExists) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
//   }
//   const hashedPassword = await bcryptjs.hash(
//     password as string,
//     Number(envVars.BCRYPT_SALT_ROUND)
//   );
//   const authProvider: IAuthProvider = {
//     provider: "credentials",
//     providerId: email as string,
//   };
//   const user = await User.create({
//     email,
//     password: hashedPassword,
//     auths: [authProvider],
//     ...rest,
//   });
//   return user;
// };
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, vehicleInfo } = payload, rest = __rest(payload, ["email", "password", "role", "vehicleInfo"]);
    // Check if user already exists
    const isUserExists = yield user_model_1.User.findOne({ email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exists");
    }
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    // Only add vehicleInfo if role is driver
    const userPayload = Object.assign(Object.assign({ email, password: hashedPassword, auths: [authProvider], role }, rest), (role === "driver" && { vehicleInfo }));
    const user = yield user_model_1.User.create(userPayload);
    return user;
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {};
    if (query.role) {
        filters.role = query.role;
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const users = yield user_model_1.User.find(filters).skip(skip).limit(limit);
    const total = yield user_model_1.User.countDocuments(filters);
    return {
        data: users,
        meta: {
            total,
        },
    };
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findById(id);
});
const updateProfile = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found!");
    }
    // Update name and phone number
    if (payload.name) {
        user.name = payload.name;
    }
    if (payload.phoneNumber) {
        user.phoneNumber = payload.phoneNumber;
    }
    // Change password if requested
    if (payload.newPassword) {
        if (!payload.oldPassword) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Old password is required to change password.");
        }
        const isOldPasswordCorrect = yield bcryptjs_1.default.compare(payload.oldPassword, user.password);
        if (!isOldPasswordCorrect) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Old password is incorrect.");
        }
        // Hash the new password
        const saltRounds = Number(env_1.envVars.BCRYPT_SALT_ROUND);
        const hashedNewPassword = yield bcryptjs_1.default.hash(payload.newPassword, saltRounds);
        user.password = hashedNewPassword;
    }
    const updatedUser = yield user.save();
    return updatedUser;
});
const blockOrUnblockUser = (userId, blockStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { isBlocked: blockStatus }, { new: true });
    return updatedUser;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    return user;
});
exports.UserService = {
    createUser,
    getAllUsers,
    getUserById,
    blockOrUnblockUser,
    getMe,
    updateProfile,
};
