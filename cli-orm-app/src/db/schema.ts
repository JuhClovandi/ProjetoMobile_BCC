import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid';

export const ufs = sqliteTable('ufs', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  nome: text('nome').notNull(),
  sigla: text('sigla', { length: 2 }).notNull().unique(),
});

export const cidades = sqliteTable('cidades', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  nome: text('nome').notNull(),
  ufId: text('uf_id').references(() => ufs.id).notNull(),
});

export const regioes = sqliteTable('regioes', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()),
  nome: text('nome').notNull(),
  cidadeId: text('cidade_id').references(() => cidades.id).notNull(),
});