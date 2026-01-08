import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

// Get config.json defaults
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = join(__dirname, 'config.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Get environment or default to 'development'
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Build connection string
let connectionString;
if (process.env.DB_URL) {
  connectionString = process.env.DB_URL;
} else {
  // Use individual environment variables or fall back to config.json defaults
  const dbUser = process.env.DB_USER || dbConfig.username;
  const dbPassword = process.env.DB_PASSWORD || dbConfig.password;
  const dbHost = process.env.DB_HOST || dbConfig.host;
  const dbPort = process.env.DB_PORT || dbConfig.port;
  const dbName = process.env.DB_NAME || dbConfig.database;

  if (!dbUser || !dbPassword || !dbHost || !dbPort || !dbName) {
    throw new Error(
      'Database configuration is missing. Please set DB_URL or provide DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, and DB_NAME environment variables.'
    );
  }

  connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export { sequelize };

