import mongoose from "mongoose";
import { hashValue } from "../../shared/utils/passwordUtils";
import { UserProfile } from "../../domain/entities/User";
import { UserRole } from "../../shared/constants/enums";

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
  omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: UserRole.USER,
      enum: Object.values(UserRole),
    },
    isVerified: { type: Boolean, required: true, default: false },
    profile: {
      firstName: { type: String },
      lastName: { type: String },
      bio: { type: String },
      avatar: { type: String },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashValue(this.password);
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as UserDocument;
  if (update && update.password) {
    update.password = await hashValue(update.password);
  }
  next();
});

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
