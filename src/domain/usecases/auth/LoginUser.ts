import { TokenType } from "../../../shared/constants/enums";
import { UNAUTHORIZED } from "../../../shared/constants/httpStatusCode";
import { LoginUserDTO, AuthResponseDTO } from "../../../shared/dtos/authDTO";
import ResponseError from "../../../shared/errors/ResponseError";
import { signToken } from "../../../shared/utils/jwtUtils";
import { compareValue } from "../../../shared/utils/passwordUtils";
import { SessionRepository } from "../../interfaces/SessionRepository";
import { UserRepository } from "../../interfaces/UserRepository";

export class LoginUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionRepository
  ) {}

  async execute(req: LoginUserDTO): Promise<AuthResponseDTO> {
    // Look up user by username
    const user = await this.userRepository.findByUsername(req.username);
    if (!user) {
      throw new ResponseError(UNAUTHORIZED, "Invalid credentials");
    }

    // Compare the password with the stored hashed password
    const isMatch = await compareValue(req.password, user.password);
    if (!isMatch) {
      throw new ResponseError(UNAUTHORIZED, "Invalid credentials");
    }

    // Create a new session for the user
    const session = await this.sessionRepository.create({
      userId: user._id,
      userAgent: req.userAgent,
    });

    // Generate access and refresh tokens
    const accessToken = signToken(
      {
        userId: user._id,
        sessionId: session._id,
        role: user.role,
      },
      TokenType.ACCESS
    );
    const refreshToken = signToken(
      { sessionId: session._id },
      TokenType.REFRESH
    );

    // Return the tokens and user info (omit password)
    return {
      accessToken,
      refreshToken,
      user: user.omitPassword(),
    };
  }
}
