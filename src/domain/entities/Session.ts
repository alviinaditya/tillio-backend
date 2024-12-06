import { Types } from "mongoose";

export class Session {
  constructor(
    public readonly _id: Types.ObjectId,
    public userId: Types.ObjectId,
    public createdAt: Date,
    public expiredAt: Date,
    public userAgent?: string
  ) {}
}
