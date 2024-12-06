import { Types } from "mongoose";
import { VerificationCodeTypes } from "../../../shared/constants/enums";
import { NOT_FOUND } from "../../../shared/constants/httpStatusCode";
import { AuthResponseDTO } from "../../../shared/dtos/authDTO";
import ResponseError from "../../../shared/errors/ResponseError";
import { UserRepository } from "../../interfaces/UserRepository";
import { VerificationCodeRepository } from "../../interfaces/VerificationCodeRepository";

export class VerifyEmail {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationCodeRepository: VerificationCodeRepository
  ) {}

  async execute(verificationCodeId: string): Promise<AuthResponseDTO> {
    // Retrieve verification code
    const verificationCode = await this.verificationCodeRepository.findById(
      new Types.ObjectId(verificationCodeId)
    );

    if (!verificationCode) {
      throw new ResponseError(
        NOT_FOUND,
        "Invalid or expired verification code"
      );
    }

    // Update user verification status
    const user = await this.userRepository.update({
      _id: verificationCode.userId,
      isVerified: true,
    });

    if (!user) {
      throw new ResponseError(NOT_FOUND, "User not found");
    }

    // Cleanup verification code
    await this.verificationCodeRepository.deleteByUserId(
      verificationCode.userId,
      VerificationCodeTypes.VERIFY_EMAIL
    );

    // Return updated user data without the password
    return {
      user: user.omitPassword(),
    };
  }
}
