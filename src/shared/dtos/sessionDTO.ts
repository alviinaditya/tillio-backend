import { Session } from "../../domain/entities/Session";

export interface GetSessionResponseDTO {
  sessions: Session[];
  currentSessionId: string;
}
