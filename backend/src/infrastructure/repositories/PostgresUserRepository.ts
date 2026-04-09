import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { PostgresDatabase } from '../database/PostgresDatabase';

export class PostgresUserRepository implements IUserRepository {
  constructor(private database: PostgresDatabase) {}

  async save(user: User): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, created_at
    `;
    const values = [user.name, user.email, user.password, user.createdAt];

    const result = await this.database.query(query, values);
    const row = result.rows[0];

    return new User(row.id, row.name, row.email, '', row.created_at);
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.database.query(query, [email]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new User(row.id, row.name, row.email, row.password, row.created_at);
  }

  async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.database.query(query, [id]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new User(row.id, row.name, row.email, '', row.created_at);
  }

  async update(user: User): Promise<User> {
    const query = `
      UPDATE users 
      SET name = $1, email = $2
      WHERE id = $3
      RETURNING id, name, email, created_at
    `;
    const values = [user.name, user.email, user.id];

    const result = await this.database.query(query, values);
    const row = result.rows[0];

    return new User(row.id, row.name, row.email, '', row.created_at);
  }

  async delete(id: number): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    await this.database.query(query, [id]);
  }

  async exists(email: string): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)';
    const result = await this.database.query(query, [email]);
    return result.rows[0].exists;
  }
}