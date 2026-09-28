const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

const runMigration = async () => {
  const migrationPath = path.join(__dirname, '001_initial_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  try {
    console.log('🔄 Executing database migration: 001_initial_schema.sql...');
    await pool.query(sql);
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
};

runMigration();
