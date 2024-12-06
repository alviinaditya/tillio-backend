import { TokenType } from "../../../shared/constants/enums";
import { UNAUTHORIZED } from "../../../shared/constants/httpStatusCode";
import { MS_PER_DAY } from "../../../shared/constants/time";
import { RefreshTokenResponseDTO } from "../../../shared/dtos/authDTO";
import ResponseError from "../../../shared/errors/ResponseError";
import {
  oneDayFromNow,
  thirtyDaysFromNow,
} from "../../../shared/utils/dateUtils";
import {
  IRefreshTokenPayload,
  signToken,
  verifyToken,
} from "../../../shared/utils/jwtUtils";
import { SessionRepository } from "../../interfaces/SessionRepository";
import { UserRepository } from "../../interfaces/UserRepository";

export class RefreshToken {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResponseDTO> {
    // Verify and decode the refresh token
    const { payload, error } = verifyToken<IRefreshTokenPayload>(
      refreshToken,
      TokenType.REFRESH
    );

    if (error || !payload) {
      throw new ResponseError(UNAUTHORIZED, "Invalid token");
    }

    const { sessionId } = payload;

    // Check if the session exists
    const session = await this.sessionRepository.checkSession(sessionId);
    if (!session) {
      throw new ResponseError(UNAUTHORIZED, "Session expired");
    }

    // Calculate one day from now in milliseconds
    const oneDayInMilliseconds = MS_PER_DAY; // 1 day in milliseconds
    const isSessionUpdateRequired =
      session.expiredAt.getTime() - Date.now() <= oneDayInMilliseconds;

    // If session expiration is within 1 day
    // update the session expiration
    if (isSessionUpdateRequired) {
      await this.sessionRepository.update({
        _id: session._id,
        expiredAt: thirtyDaysFromNow(),
      });
    }

    // Find the user associated with the session
    const user = await this.userRepository.findById(session.userId);
    if (!user) {
      throw new ResponseError(UNAUTHORIZED, "User not found");
    }

    // Create new access token
    const newAccessToken = signToken(
      {
        userId: session.userId,
        sessionId: session._id,
        role: user.role,
      },
      TokenType.ACCESS
    );

    // Optionally create a new refresh token if the session was updated
    const response: RefreshTokenResponseDTO = {
      accessToken: newAccessToken,
    };

    if (isSessionUpdateRequired) {
      response.refreshToken = signToken(
        { sessionId: session._id },
        TokenType.REFRESH
      );
    }

    return response;
  }
}
