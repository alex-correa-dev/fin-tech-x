import { ChatMessage } from '../entities/ChatMessage';

export interface IChatRepository {
  save(message: ChatMessage): Promise<ChatMessage>;
  findByUserId(userId: number, limit?: number): Promise<ChatMessage[]>;
  findById(id: number): Promise<ChatMessage | null>;
  deleteOldMessages(userId: number, daysToKeep?: number): Promise<number>;
  deleteAll(userId: number): Promise<void>;
}
