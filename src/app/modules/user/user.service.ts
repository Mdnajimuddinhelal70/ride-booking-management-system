import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
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

const blockOrUnblockUser = async (userId: string, blockStatus: boolean) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: blockStatus },
    { new: true }
  );
  return updatedUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  getUserById,
  blockOrUnblockUser,
};
