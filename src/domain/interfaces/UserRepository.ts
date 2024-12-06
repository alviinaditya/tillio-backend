import { Types } from "mongoose";
import { User } from "../entities/User";

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(userId: Types.ObjectId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(data: Partial<User>): Promise<User>;
  update(data: Partial<User>): Promise<User>;
  delete(userId: Types.ObjectId): Promise<void>;
}
