import { Types } from "mongoose";
import { VerificationCodeTypes } from "../../shared/constants/enums";

export class VerificationCode {
  constructor(
    public readonly _id: Types.ObjectId,
    public userId: Types.ObjectId,
    public type: VerificationCodeTypes,
    public createdAt: Date,
    public expiredAt: Date
  ) {}
}
