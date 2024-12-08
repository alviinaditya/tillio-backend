import { Types } from "mongoose";
import { UserRepository } from "../../interfaces/UserRepository";
import { User } from "../../entities/User";
import ResponseError from "../../../shared/errors/ResponseError";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../../../shared/constants/httpStatusCode";
import { ChangePasswordDTO } from "../../../shared/dtos/userDTO";
import { compareValue } from "../../../shared/utils/passwordUtils";
import { SessionRepository } from "../../interfaces/SessionRepository";

export class ChangePassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository
  ) {}
  async execute(req: ChangePasswordDTO): Promise<void> {
    const user = await this.userRepository.findById(req.userId);
    if (!user) {
      throw new ResponseError(NOT_FOUND, "User not found");
    }

    // Compare the password with the stored hashed password
    const isMatch = await compareValue(req.currentPassword, user.password);
    if (!isMatch) {
      throw new ResponseError(UNAUTHORIZED, "Current password is incorrect");
    }

    // Attempt to update the user's password
    const result = await this.userRepository.update({
      _id: req.userId,
      password: req.newPassword,
    });
    if (!result) {
      throw new ResponseError(
        INTERNAL_SERVER_ERROR,
        "Failed to reset password"
      );
    }

    if (req.logoutOtherSessions) {
      await this.sessionRepository.deleteByUserId(
        req.userId,
        req.currentSessionId
      );
    }
  }
}
