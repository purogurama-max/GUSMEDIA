const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'sales_dashboard_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL client error', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
