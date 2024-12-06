import { VerificationCodeTypes } from "../../../shared/constants/enums";
import {
  CONFLICT,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
} from "../../../shared/constants/httpStatusCode";
import ResponseError from "../../../shared/errors/ResponseError";
import { emailProvider } from "../../../shared/providers/EmailProvider";
import {
  fiveMinutesAgo,
  thirtyDaysFromNow,
} from "../../../shared/utils/dateUtils";
import { UserRepository } from "../../interfaces/UserRepository";
import { VerificationCodeRepository } from "../../interfaces/VerificationCodeRepository";

export class ResendVerificationEmail {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationCodeRepository: VerificationCodeRepository
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    // Find the user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new ResponseError(NOT_FOUND, "Email not found");
    }

    // If the email is already verified, return a conflict error
    if (user.isVerified) {
      throw new ResponseError(CONFLICT, "Email already verified");
    }

    // Check the number of verification email requests in the last 5 minutes
    const requestCount = await this.verificationCodeRepository.count(
      user._id,
      VerificationCodeTypes.VERIFY_EMAIL,
      fiveMinutesAgo() // Utility function to get 5 minutes ago
    );

    // If there are too many requests, throw a "Too Many Requests" error
    if (requestCount >= 3) {
      throw new ResponseError(
        TOO_MANY_REQUESTS,
        "Too many requests. Please try again later."
      );
    }

    // Create a new verification code for the user
    const verificationCode = await this.verificationCodeRepository.create({
      userId: user._id,
      type: VerificationCodeTypes.VERIFY_EMAIL,
      expiredAt: thirtyDaysFromNow(), // Code expires in 30 days
    });

    // Send the verification email with the generated code
    await emailProvider.sendVerificationEmail(
      user.email,
      verificationCode._id.toString()
    );

    // Return success message
    return { message: "Verification email sent" };
  }
}
