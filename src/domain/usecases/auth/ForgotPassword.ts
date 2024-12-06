import { VerificationCodeTypes } from "../../../shared/constants/enums";
import {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
} from "../../../shared/constants/httpStatusCode";
import ResponseError from "../../../shared/errors/ResponseError";
import { emailProvider } from "../../../shared/providers/EmailProvider";
import {
  fiveMinutesAgo,
  oneHourFromNow,
} from "../../../shared/utils/dateUtils";
import { UserRepository } from "../../interfaces/UserRepository";
import { VerificationCodeRepository } from "../../interfaces/VerificationCodeRepository";

export class ForgotPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationCodeRepository: VerificationCodeRepository
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    // Check if the user exists in the system
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ResponseError(NOT_FOUND, "User not found");
    }

    // Check how many reset password requests were made in the last 5 minutes
    const limit = await this.verificationCodeRepository.count(
      user._id,
      VerificationCodeTypes.RESET_PASSWORD,
      fiveMinutesAgo()
    );

    // If the limit of 3 requests is exceeded in the last 5 minutes, block further attempts
    if (limit >= 3) {
      throw new ResponseError(
        TOO_MANY_REQUESTS,
        "Too many requests. Please try again later."
      );
    }

    // Create a new verification code for the user to reset their password
    const verificationCode = await this.verificationCodeRepository.create({
      userId: user._id,
      type: VerificationCodeTypes.RESET_PASSWORD,
      expiredAt: oneHourFromNow(),
    });

    // If the verification code creation fails, throw an internal server error
    if (!verificationCode) {
      throw new ResponseError(
        INTERNAL_SERVER_ERROR,
        "Failed to create verification code"
      );
    }

    // Send the password reset email to the user with the verification code
    await emailProvider.sendPasswordResetEmail(
      user.email,
      verificationCode._id.toString()
    );

    // Return a success message to the caller
    return { message: "Password reset email sent successfully" };
  }
}
