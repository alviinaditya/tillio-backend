import {
  TokenType,
  VerificationCodeTypes,
} from "../../../shared/constants/enums";
import { CONFLICT } from "../../../shared/constants/httpStatusCode";
import { RegisterUserDTO, AuthResponseDTO } from "../../../shared/dtos/authDTO";
import ResponseError from "../../../shared/errors/ResponseError";
import { emailProvider } from "../../../shared/providers/EmailProvider";
import { thirtyDaysFromNow } from "../../../shared/utils/dateUtils";
import { signToken } from "../../../shared/utils/jwtUtils";
import { User } from "../../entities/User";
import { SessionRepository } from "../../interfaces/SessionRepository";
import { UserRepository } from "../../interfaces/UserRepository";
import { VerificationCodeRepository } from "../../interfaces/VerificationCodeRepository";

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly verificationCodeRepository: VerificationCodeRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  async execute(
    registerUserDTO: RegisterUserDTO
  ): Promise<Omit<User, "password">> {
    // Check if email already exists
    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.findByEmail(registerUserDTO.email),
      this.userRepository.findByUsername(registerUserDTO.username),
    ]);

    if (emailExists) {
      throw new ResponseError(CONFLICT, "Email already exists");
    }

    if (usernameExists) {
      throw new ResponseError(CONFLICT, "Username already exists");
    }

    // Create the user
    const user = await this.userRepository.create({
      username: registerUserDTO.username,
      email: registerUserDTO.email,
      password: registerUserDTO.password,
    });

    const userId = user._id;

    // Create verification code for email verification
    const verificationCode = await this.verificationCodeRepository.create({
      userId,
      type: VerificationCodeTypes.VERIFY_EMAIL,
      expiredAt: thirtyDaysFromNow(),
    });

    // Send verification email
    await emailProvider.sendVerificationEmail(
      user.email,
      verificationCode._id.toString()
    );

    return user.omitPassword();
  }
}
