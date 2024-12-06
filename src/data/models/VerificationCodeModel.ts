import mongoose from "mongoose";
import { VerificationCodeTypes } from "../../shared/constants/enums";
import { thirtyDaysFromNow } from "../../shared/utils/dateUtils";

interface VerificationCodeDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: VerificationCodeTypes;
  createdAt: Date;
  expiredAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(VerificationCodeTypes),
      required: true,
    },
    createdAt: { type: Date, required: true, default: Date.now },
    expiredAt: { type: Date, required: true, default: thirtyDaysFromNow() },
  },
  { collection: "verification_codes" }
);

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
  "VerificationCode",
  verificationCodeSchema
);
export default VerificationCodeModel;
