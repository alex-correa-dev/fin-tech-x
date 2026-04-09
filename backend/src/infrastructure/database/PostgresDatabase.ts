import { Pool, PoolConfig, QueryResult } from 'pg';
import config from '../../config/env';

export class PostgresDatabase {
  private pool: Pool;

  constructor() {
    const dbConfig: PoolConfig = {
      user: config.database.user,
      password: config.database.password,
      host: config.database.host,
      port: config.database.port,
      database: config.database.database,
    };

    this.pool = new Pool(dbConfig);
  }

  async connect(): Promise<void> {
    try {
      await this.pool.connect();
      console.log('✅ Conectado ao PostgreSQL');
      await this.createTables();
    } catch (error) {
      console.error('❌ Erro ao conectar ao PostgreSQL:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE INDEX IF NOT EXISTS idx_user_email ON users(email)`,
      `CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_history(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_history(created_at)`
    ];

    for (const query of queries) {
      await this.pool.query(query);
    }
    console.log('✅ Tabelas criadas/verificadas');
  }

  async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  getPool(): Pool {
    return this.pool;
  }

  async disconnect(): Promise<void> {
    await this.pool.end();
    console.log('🔌 Desconectado do PostgreSQL');
  }
}