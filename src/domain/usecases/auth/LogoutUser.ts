import { TokenType } from "../../../shared/constants/enums";
import { UNAUTHORIZED } from "../../../shared/constants/httpStatusCode";
import ResponseError from "../../../shared/errors/ResponseError";
import {
  IAccessTokenPayload,
  verifyToken,
} from "../../../shared/utils/jwtUtils";
import { SessionRepository } from "../../interfaces/SessionRepository";

export class LogoutUser {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(accessToken: string): Promise<{ message: string }> {
    // Verify the access token
    const { error, payload } = verifyToken<IAccessTokenPayload>(
      accessToken,
      TokenType.ACCESS
    );

    // Handle invalid or expired token error
    if (error || !payload) {
      throw new ResponseError(
        UNAUTHORIZED,
        `Invalid or expired access token: ${error || "No payload"}`
      );
    }

    const { sessionId } = payload;

    // Call delete - if it fails, it will throw an error automatically
    await this.sessionRepository.delete(sessionId);

    return { message: "Logout successful" };
  }
}
