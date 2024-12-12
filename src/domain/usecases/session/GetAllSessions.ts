import { Session } from "../../entities/Session";
import { SessionRepository } from "../../interfaces/SessionRepository";

export class GetAllSessions {
  constructor(private readonly sessionRepository: SessionRepository) {}
  async execute(): Promise<Session[]> {
    return await this.sessionRepository.findAll();
  }
}
