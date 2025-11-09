/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

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

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, role, vehicleInfo, ...rest } = payload;

  // Check if user already exists
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }

  // Hash the password
  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  // Only add vehicleInfo if role is driver
  const userPayload: Partial<IUser> = {
    email,
    password: hashedPassword,
    auths: [authProvider],
    role,
    ...rest,
    ...(role === "driver" && { vehicleInfo }),
  };

  const user = await User.create(userPayload);
  return user;
};

const getAllUsers = async (
  query: Record<string, string>
): Promise<{ data: IUser[]; meta: { total: number } }> => {
  const filters: Record<string, unknown> = {};

  if (query.role) {
    filters.role = query.role;
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find(filters).skip(skip).limit(limit);
  const total = await User.countDocuments(filters);

  return {
    data: users,
    meta: {
      total,
    },
  };
};

const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

const updateProfile = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
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
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Old password is required to change password."
      );
    }

    const isOldPasswordCorrect = await bcryptjs.compare(
      payload.oldPassword,
      user.password!
    );
    if (!isOldPasswordCorrect) {
      throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect.");
    }

    // Hash the new password
    const saltRounds = Number(envVars.BCRYPT_SALT_ROUND);
    const hashedNewPassword = await bcryptjs.hash(
      payload.newPassword,
      saltRounds
    );
    user.password = hashedNewPassword;
  }

  const updatedUser = await user.save();
  return updatedUser;
};

const blockOrUnblockUser = async (userId: string, blockStatus: boolean) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: blockStatus },
    { new: true }
  );
  return updatedUser;
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  blockOrUnblockUser,
  getMe,
  updateProfile,
};
