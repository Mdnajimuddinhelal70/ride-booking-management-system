import { IUser } from "../user/user.interface";

export interface IAdminFilter {
  role?: string;
  status?: string;
  search?: string;
}

export interface IAdminService {
  getAllUsers(filter: IAdminFilter): Promise<IUser[]>;
  updateUserStatus(id: string, status: string): Promise<IUser | null>;
  updateDriverApproval(id: string, approved: boolean): Promise<IUser | null>;
}
