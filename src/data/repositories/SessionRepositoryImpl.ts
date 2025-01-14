import { Types } from "mongoose";
import { Session } from "../../domain/entities/Session";
import { SessionRepository } from "../../domain/interfaces/SessionRepository";
import SessionModel from "../models/SessionModel";

export class SessionRepositoryImpl implements SessionRepository {
  async findAll(): Promise<Session[]> {
    const sessions = await SessionModel.find().exec();
    return sessions;
  }
  async findById(sessionId: Types.ObjectId): Promise<Session | null> {
    return await SessionModel.findOne({ _id: sessionId });
  }
  async findByUserId(userId: Types.ObjectId): Promise<Session[] | null> {
    return await SessionModel.find({ userId });
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
  async deleteByUserId(
    userId: Types.ObjectId,
    exceptSessionId?: Types.ObjectId
  ): Promise<void> {
    const query: { userId: Types.ObjectId; _id?: { $ne: Types.ObjectId } } = {
      userId,
    };
    if (exceptSessionId) {
      query._id = { $ne: exceptSessionId };
    }
    await SessionModel.deleteMany(query);
  }
}
