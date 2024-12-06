import { Types } from "mongoose";
import { UserRole } from "../../shared/constants/enums";

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

export class User {
  constructor(
    public readonly _id: Types.ObjectId,
    public username: string,
    public email: string,
    public role: UserRole,
    public password: string,
    public isVerified: boolean = false,
    public profile?: UserProfile
  ) {}

  omitPassword(): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword as Omit<User, "password">;
  }
}
