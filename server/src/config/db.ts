import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Auto-create .env with default fallback if missing in git checkout
const envPath = path.resolve(__dirname, '../../.env');
if (!fs.existsSync(envPath)) {
  try {
    fs.writeFileSync(
      envPath,
      'PORT=5000\nDATABASE_URL="file:./dev.db"\nJWT_SECRET="smart_expense_tracker_secret_key_2026"\nNODE_ENV="development"\n'
    );
  } catch (err) {
    // Ignore fallback file write errors
  }
}

dotenv.config({ path: envPath });

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
process.env.DATABASE_URL = databaseUrl;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});
