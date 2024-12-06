import { Types } from "mongoose";
import { VerificationCodeTypes } from "../../shared/constants/enums";
import { VerificationCode } from "../entities/VerificationCode";

export interface VerificationCodeRepository {
  findById(
    verificationCodeId: Types.ObjectId
  ): Promise<VerificationCode | null>;
  findByUserId(userId: Types.ObjectId): Promise<VerificationCode | null>;
  count(
    userId: Types.ObjectId,
    type: VerificationCodeTypes,
    createdAfter?: Date
  ): Promise<number>;
  create(data: Partial<VerificationCode>): Promise<VerificationCode>;
  update(data: Partial<VerificationCode>): Promise<VerificationCode>;
  delete(verificationCodeId: Types.ObjectId): Promise<void>;
  deleteByUserId(
    userId: Types.ObjectId,
    type?: VerificationCodeTypes
  ): Promise<void>;
}
