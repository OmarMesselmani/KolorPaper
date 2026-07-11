const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');
const sqlPath = path.join(__dirname, '../backup.sql');

try {
  console.log('Connecting to existing prisma/dev.db...');
  const db = new DatabaseSync(dbPath);

  // Read SQL dump
  console.log('Reading backup.sql...');
  let sql = fs.readFileSync(sqlPath, 'utf8');

  // Remove CREATE INDEX statements because the local dev.db already has them
  // and they don't have "IF NOT EXISTS", which causes errors.
  sql = sql
    .split('\n')
    .filter(line => !line.startsWith('CREATE INDEX') && !line.startsWith('CREATE UNIQUE INDEX'))
    .join('\n');

  // Disable foreign key checks for the import
  db.exec('PRAGMA foreign_keys = OFF;');

  // Clear all tables except sqlite_sequence
  console.log('Clearing existing data...');
  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations'`).all();
  
  for (const table of tables) {
    db.exec(`DELETE FROM "${table.name}";`);
  }

  // Execute the SQL dump
  console.log('Executing SQL dump (this might take a moment)...');
  db.exec(sql);

  console.log('Successfully imported data to prisma/dev.db!');
} catch (error) {
  console.error('Error importing database:', error.message);
  process.exit(1);
}
