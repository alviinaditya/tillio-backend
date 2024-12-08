import { Types } from "mongoose";
import { Session } from "../entities/Session";

export interface SessionRepository {
  findById(sessionId: Types.ObjectId): Promise<Session | null>;
  checkSession(sessionId: Types.ObjectId): Promise<Session | null>;
  create(data: Partial<Session>): Promise<Session>;
  update(data: Partial<Session>): Promise<Session>;
  delete(sessionId: Types.ObjectId): Promise<void>;
  deleteByUserId(
    userId: Types.ObjectId,
    exceptSessionId?: Types.ObjectId
  ): Promise<void>;
}
