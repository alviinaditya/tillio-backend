import { Types } from "mongoose";
import { UserRepository } from "../../interfaces/UserRepository";
import { User } from "../../entities/User";
import ResponseError from "../../../shared/errors/ResponseError";
import { NOT_FOUND } from "../../../shared/constants/httpStatusCode";

export class GetUser {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(userId: Types.ObjectId): Promise<Omit<User, "password">> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ResponseError(NOT_FOUND, "User not found");
    }
    return user.omitPassword();
  }
}
