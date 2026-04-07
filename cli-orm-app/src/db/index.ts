import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

// Isso garante que ele use o arquivo na raiz do projeto, independente de onde o script é chamado
const sqlite = new Database(path.resolve(__dirname, '../../../sqlite.db'));

export const db = drizzle(sqlite, { schema });