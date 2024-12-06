import { Types } from "mongoose";
import { VerificationCodeTypes } from "../../../shared/constants/enums";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../../../shared/constants/httpStatusCode";
import { AuthResponseDTO } from "../../../shared/dtos/authDTO";
import ResponseError from "../../../shared/errors/ResponseError";
import { SessionRepository } from "../../interfaces/SessionRepository";
import { UserRepository } from "../../interfaces/UserRepository";
import { VerificationCodeRepository } from "../../interfaces/VerificationCodeRepository";
import { hashValue } from "../../../shared/utils/passwordUtils";

export class ResetPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationCodeRepository: VerificationCodeRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  async execute(
    verificationCodeId: string,
    password: string
  ): Promise<AuthResponseDTO> {
    const verificationCode = await this.verificationCodeRepository.findById(
      new Types.ObjectId(verificationCodeId)
    );

    // Check if verification code is valid
    if (!verificationCode || verificationCode.expiredAt < new Date()) {
      throw new ResponseError(
        NOT_FOUND,
        "Invalid or expired verification code"
      );
    }

    // Attempt to update the user's password
    const user = await this.userRepository.update({
      _id: verificationCode.userId,
      password,
    });

    if (!user) {
      throw new ResponseError(
        INTERNAL_SERVER_ERROR,
        "Failed to reset password"
      );
    }

    // Clean up verification code and session
    await Promise.all([
      this.verificationCodeRepository.deleteByUserId(
        verificationCode.userId,
        VerificationCodeTypes.RESET_PASSWORD
      ),
      this.sessionRepository.deleteByUserId(user._id),
    ]);

    // Return updated user data without password
    return {
      user: user.omitPassword(),
    };
  }
}
