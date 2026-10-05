import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'gpt-3.5-turbo',
  AI_MOCK_MODE: process.env.AI_MOCK_MODE !== 'false',
  NODE_ENV: process.env.NODE_ENV || 'development'
};
