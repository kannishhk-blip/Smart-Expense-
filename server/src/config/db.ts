import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const envPath = path.resolve(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  try {
    fs.writeFileSync(
      envPath,
      'PORT=5000\nDATABASE_URL="file:./dev.db"\nJWT_SECRET="smart_expense_tracker_secret_key_2026"\nNODE_ENV="development"\n'
    );
  } catch (err) {}
}

dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
process.env.DATABASE_URL = databaseUrl;

export const ensureDbSchema = () => {
  try {
    const prismaDir = path.resolve(__dirname, '../../prisma');
    execSync('npx prisma db push --skip-generate', {
      cwd: path.resolve(__dirname, '../../'),
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'ignore',
    });
  } catch (err) {
    // Ignore schema sync errors if already initialized
  }
};

// Initial auto-sync check on load
ensureDbSchema();

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});
