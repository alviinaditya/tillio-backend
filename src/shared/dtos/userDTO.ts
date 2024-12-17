import { Types } from "mongoose";

export interface ChangePasswordDTO {
  userId: Types.ObjectId;
  currentPassword: string;
  newPassword: string;
  logoutOtherSessions: boolean;
  currentSessionId: Types.ObjectId;
}

export interface UpdateProfileDTO {
  userId: Types.ObjectId;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}
