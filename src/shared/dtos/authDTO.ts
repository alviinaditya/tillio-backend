import { Request } from "express";
import { User } from "../../domain/entities/User";
import { UserRole } from "../constants/enums";
import { Types } from "mongoose";

export interface RegisterUserDTO extends LoginUserDTO {
  email: string;
}

export interface AuthRequest extends Request {
  userId: Types.ObjectId | undefined;
  role: UserRole | undefined;
}

export interface LoginUserDTO {
  username: string;
  password: string;
  userAgent?: string;
}

export interface AuthResponseDTO {
  accessToken?: string;
  refreshToken?: string;
  user: Omit<User, "password">;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
  refreshToken?: string;
}

export interface ResetPasswordDTO {
  code: string;
  password: string;
}
