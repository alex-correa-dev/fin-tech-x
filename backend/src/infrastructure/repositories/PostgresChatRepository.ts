import { ChatMessage } from '../../domain/entities/ChatMessage';
import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { PostgresDatabase } from '../database/PostgresDatabase';

export class PostgresChatRepository implements IChatRepository {
  constructor(private database: PostgresDatabase) {}

  async save(message: ChatMessage): Promise<ChatMessage> {
    const query = `
      INSERT INTO chat_history (user_id, question, answer, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, question, answer, created_at
    `;
    const values = [message.userId, message.question, message.answer, message.createdAt];

    const result = await this.database.query(query, values);
    const row = result.rows[0];

    return new ChatMessage(row.id, row.user_id, row.question, row.answer, row.created_at);
  }

  async findByUserId(userId: number, limit: number = 50): Promise<ChatMessage[]> {
    const query = `
      SELECT * FROM chat_history 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await this.database.query(query, [userId, limit]);

    return result.rows.map(
      (row) => new ChatMessage(row.id, row.user_id, row.question, row.answer, row.created_at)
    );
  }

  async findById(id: number): Promise<ChatMessage | null> {
    const query = 'SELECT * FROM chat_history WHERE id = $1';
    const result = await this.database.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new ChatMessage(row.id, row.user_id, row.question, row.answer, row.created_at);
  }

  async deleteOldMessages(userId: number, daysToKeep: number = 30): Promise<number> {
    const query = `
      DELETE FROM chat_history 
      WHERE user_id = $1 AND created_at < NOW() - INTERVAL '${daysToKeep} days'
      RETURNING id
    `;
    const result = await this.database.query(query, [userId]);
    return result.rowCount || 0;
  }

  async deleteAll(userId: number): Promise<void> {
    const query = 'DELETE FROM chat_history WHERE user_id = $1';
    await this.database.query(query, [userId]);
  }
}
