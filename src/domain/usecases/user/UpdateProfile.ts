import { UserRepository } from "../../interfaces/UserRepository";
import { User } from "../../entities/User";
import ResponseError from "../../../shared/errors/ResponseError";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} from "../../../shared/constants/httpStatusCode";
import { UpdateProfileDTO } from "../../../shared/dtos/userDTO";
import deletePublicFile from "../../../shared/utils/deleteFileUtils";
import { logger } from "../../../shared/providers/LoggerProvider";

export class UpdateProfile {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(payload: UpdateProfileDTO): Promise<Omit<User, "password">> {
    // Retrieve the user by ID
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new ResponseError(NOT_FOUND, "User not found");
    }

    // Check if email is changed and if it's already in use
    if (payload.email && payload.email !== user.email) {
      await this.checkIfEmailExists(payload.email);
    }

    // Check if username is changed and if it's already in use
    if (payload.username && payload.username !== user.username) {
      await this.checkIfUsernameExists(payload.username);
    }

    // Prepare the data to update the user profile
    const updatedData: Partial<User> = {
      _id: user._id,
      username: payload.username || user.username,
      email: payload.email || user.email,
      profile: {
        firstName: payload.firstName || user.profile?.firstName,
        lastName: payload.lastName || user.profile?.lastName,
        bio: payload.bio || user.profile?.bio,
        avatar: payload.avatar || user.profile?.avatar,
      },
    };

    // Update the user profile
    const updatedUser = await this.userRepository.update(updatedData);
    if (!updatedUser) {
      throw new ResponseError(
        INTERNAL_SERVER_ERROR,
        "Failed to update profile"
      );
    }

    // Delete the old avatar if exists
    if (user.profile?.avatar) {
      await this.deleteOldAvatar(user.profile.avatar);
    }

    return updatedUser.omitPassword();
  }

  // Helper function to check if email already exists
  private async checkIfEmailExists(email: string) {
    const emailExists = await this.userRepository.findByEmail(email);
    if (emailExists) {
      throw new ResponseError(
        CONFLICT,
        "Email is already in use by another account"
      );
    }
  }

  // Helper function to check if username already exists
  private async checkIfUsernameExists(username: string) {
    const usernameExists = await this.userRepository.findByUsername(username);
    if (usernameExists) {
      throw new ResponseError(
        CONFLICT,
        "Username is already in use by another account"
      );
    }
  }

  // Helper function to delete the old avatar
  private async deleteOldAvatar(avatar: string) {
    try {
      await deletePublicFile(avatar);
    } catch (error: any) {
      logger.error("Error deleting old avatar:", error.message);
    }
  }
}
