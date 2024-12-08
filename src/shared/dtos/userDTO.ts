import { Types } from "mongoose";

export interface ChangePasswordDTO {
  userId: Types.ObjectId;
  currentPassword: string;
  newPassword: string;
  logoutOtherSessions: boolean;
  currentSessionId: Types.ObjectId;
}
