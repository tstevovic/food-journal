import dotenv from 'dotenv';

dotenv.config();

interface Config {
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  server: {
    port: number;
  };
  nodeEnv: string;
  logging: {
    level: string;
  };
}

const config: Config = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'food_journal_user',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_DATABASE || 'food_journal_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

export { config };
