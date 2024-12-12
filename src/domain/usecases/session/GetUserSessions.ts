import { Types } from "mongoose";
import { SessionRepository } from "../../interfaces/SessionRepository";
import { Session } from "../../entities/Session";
import ResponseError from "../../../shared/errors/ResponseError";
import { NOT_FOUND } from "../../../shared/constants/httpStatusCode";

export class GetUserSessions {
  constructor(private readonly sessionRepository: SessionRepository) {}
  async execute(userId: Types.ObjectId): Promise<Session[]> {
    const sessions = await this.sessionRepository.findByUserId(userId);
    if (!sessions) {
      throw new ResponseError(NOT_FOUND, "Sessions not found");
    }
    return sessions;
  }
}
