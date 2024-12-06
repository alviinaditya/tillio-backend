import { Types } from "mongoose";
import { Session } from "../../domain/entities/Session";
import { SessionRepository } from "../../domain/interfaces/SessionRepository";
import SessionModel from "../models/SessionModel";

export class SessionRepositoryImpl implements SessionRepository {
  async findById(sessionId: Types.ObjectId): Promise<Session | null> {
    return await SessionModel.findOne({ sessionId });
  }
  async checkSession(sessionId: Types.ObjectId): Promise<Session | null> {
    return await SessionModel.findOne({
      _id: sessionId,
      expiredAt: { $gt: Date.now() },
    });
  }
  async create(data: Partial<Session>): Promise<Session> {
    const session = new SessionModel(data);
    return await session.save();
  }
  async update(data: Partial<Session>): Promise<Session> {
    const session = await SessionModel.findByIdAndUpdate(data._id, data, {
      new: true,
    });
    if (!session) {
      throw new Error(`Session ${data._id} not found`);
    }
    return session;
  }
  async delete(sessionId: Types.ObjectId): Promise<void> {
    await SessionModel.findByIdAndDelete(sessionId);
  }
  async deleteByUserId(userId: Types.ObjectId): Promise<void> {
    await SessionModel.deleteMany({ userId });
  }
}
