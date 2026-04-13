import dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export interface ServerConfig {
  port: number;
  env: string;
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

export interface AIConfig {
  provider: string;
  apiKey: string;
  modelName: string;
}

export interface Config {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JWTConfig;
  ai: AIConfig;
}

const config: Config = {
  server: {
    port: parseInt(process.env.PORT || '5000'),
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fintechx_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    expiresIn: '7d',
  },
  ai: {
    provider: 'gemini',
    apiKey: process.env.GEMINI_API_KEY || '',
    modelName: process.env.GEMINI_MODEL_NAME || 'gemini-2.0-flash',
  },
};

if (!config.database.user || !config.database.password) {
  console.warn('⚠️  Database credentials missing. Check your .env file');
}

if (!config.jwt.secret || config.jwt.secret === 'default_secret_change_me') {
  console.warn('⚠️  JWT_SECRET is using default value. Change it in production!');
}

if (!config.ai.apiKey) {
  console.warn('⚠️  GEMINI_API_KEY is missing. AI features will not work!');
}

export default config;
