import { Types } from "mongoose";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/UserRepository";
import UserModel from "../models/UserModel";
import ResponseError from "../../shared/errors/ResponseError";
import { NOT_FOUND } from "../../shared/constants/httpStatusCode";

export class UserRepositoryImpl implements UserRepository {
  // Get all users
  async findAll(): Promise<User[]> {
    return await UserModel.find();
  }
  // Find a user by their ID
  async findById(userId: Types.ObjectId): Promise<User | null> {
    return await UserModel.findById(userId);
  }

  // Find a user by their email address
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  // Find a user by their username
  async findByUsername(username: string): Promise<User | null> {
    return await UserModel.findOne({ username });
  }

  // Create a new user
  async create(data: Partial<User>): Promise<User> {
    const user = new UserModel(data);
    return await user.save();
  }

  // Update a user by their ID
  async update(data: Partial<User>): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(data._id, data, {
      new: true,
    });

    if (!user) {
      throw new ResponseError(NOT_FOUND, `User ${data._id} not found`);
    }

    return user;
  }

  // Delete a user by their ID
  async delete(userId: Types.ObjectId): Promise<void> {
    const result = await UserModel.findByIdAndDelete(userId);

    if (!result) {
      throw new ResponseError(NOT_FOUND, `User ${userId} not found`);
    }
  }
}
