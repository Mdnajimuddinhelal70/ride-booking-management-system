/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../user/user.model";

const getAllUsers = async (filter: any) => {
  return await User.find(filter).sort({ createdAt: -1 });
};

const updateUserStatus = async (id: string, status: string) => {
  return await User.findByIdAndUpdate(id, { status }, { new: true });
};

const updateDriverApproval = async (id: string, approved: boolean) => {
  return await User.findByIdAndUpdate(
    id,
    { isApproved: approved },
    { new: true }
  );
};

export const AdminServices = {
  getAllUsers,
  updateUserStatus,
  updateDriverApproval,
};
