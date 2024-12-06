import { Types } from "mongoose";
import { VerificationCode } from "../../domain/entities/VerificationCode";
import { VerificationCodeRepository } from "../../domain/interfaces/VerificationCodeRepository";
import { VerificationCodeTypes } from "../../shared/constants/enums";
import VerificationCodeModel from "../models/VerificationCodeModel";
import ResponseError from "../../shared/errors/ResponseError";
import { NOT_FOUND } from "../../shared/constants/httpStatusCode";

export class VerificationCodeRepositoryImpl
  implements VerificationCodeRepository
{
  // Fetch verification code by its ID
  async findById(
    verificationCodeId: Types.ObjectId
  ): Promise<VerificationCode | null> {
    return await VerificationCodeModel.findById(verificationCodeId);
  }

  // Fetch verification code by the user ID
  async findByUserId(userId: Types.ObjectId): Promise<VerificationCode | null> {
    return await VerificationCodeModel.findOne({ userId });
  }

  // Count the number of verification codes for a user and type, optionally filtered by createdAt
  async count(
    userId: Types.ObjectId,
    type: VerificationCodeTypes,
    createdAfter?: Date
  ): Promise<number> {
    const query: {
      userId: Types.ObjectId;
      type: VerificationCodeTypes;
      createdAt?: { $gt: Date };
    } = { userId, type };
    if (createdAfter) {
      query["createdAt"] = { $gt: createdAfter };
    }
    return await VerificationCodeModel.countDocuments(query);
  }

  // Create a new verification code
  async create(data: Partial<VerificationCode>): Promise<VerificationCode> {
    const verificationCode = new VerificationCodeModel(data);
    return await verificationCode.save();
  }

  // Update an existing verification code by its ID
  async update(data: Partial<VerificationCode>): Promise<VerificationCode> {
    const verificationCode = await VerificationCodeModel.findByIdAndUpdate(
      data._id,
      data,
      { new: true }
    );

    if (!verificationCode) {
      throw new ResponseError(
        NOT_FOUND,
        `Verification code ${data._id} not found`
      );
    }

    return verificationCode;
  }

  // Delete a verification code by its ID
  async delete(verificationCodeId: Types.ObjectId): Promise<void> {
    await VerificationCodeModel.findByIdAndDelete(verificationCodeId);
  }

  // Delete all verification codes for a user, optionally filtered by type
  async deleteByUserId(
    userId: Types.ObjectId,
    type?: VerificationCodeTypes
  ): Promise<void> {
    await VerificationCodeModel.deleteMany({ userId, type });
  }
}
