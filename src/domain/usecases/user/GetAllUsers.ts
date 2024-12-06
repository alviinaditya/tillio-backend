import { UserRepository } from "../../interfaces/UserRepository";
import { User } from "../../entities/User";

export class GetAllUsers {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
