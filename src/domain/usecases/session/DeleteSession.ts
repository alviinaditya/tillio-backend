import { Types } from "mongoose";
import { SessionRepository } from "../../interfaces/SessionRepository";
import ResponseError from "../../../shared/errors/ResponseError";
import { NOT_FOUND } from "../../../shared/constants/httpStatusCode";

export class DeleteSession {
  constructor(private readonly sessionRepository: SessionRepository) {}
  async execute(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findById(
      new Types.ObjectId(sessionId)
    );
    if (!session) {
      throw new ResponseError(NOT_FOUND, "Session not found");
    }
    await this.sessionRepository.delete(new Types.ObjectId(sessionId));
  }
}
