import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'registrations.db');

// Cria o banco se não existir
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao abrir DB:', err);
});

// Garante que a tabela existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS inscricoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      bairro TEXT,
      whatsapp TEXT,
      curso TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
});

export default db;