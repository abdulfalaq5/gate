// Script untuk list semua tabel di database
const knex = require('knex');
require('dotenv').config();

const config = {
  client: process.env.DB_CLIENT_DEV || 'pg',
  connection: {
    host: process.env.DB_HOST_DEV || 'localhost',
    port: process.env.DB_PORT_DEV || 5432,
    user: process.env.DB_USER_DEV || 'postgres',
    password: process.env.DB_PASS_DEV || 'password',
    database: 'gate_db', // Use gate_db yang sudah kita tahu ada
  },
};

async function listTables() {
  const db = knex(config);
  
  try {
    console.log('🔍 Checking tables in database: gate_db\n');
    
    // List semua tabel
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📋 Tables found:', tables.rows.length);
    tables.rows.forEach((row, idx) => {
      console.log(`  ${idx + 1}. ${row.table_name}`);
    });
    
    // Cek apakah ada tabel employees (case insensitive)
    const employeeTables = tables.rows.filter(t => 
      t.table_name.toLowerCase().includes('employee')
    );
    
    if (employeeTables.length > 0) {
      console.log('\n✅ Found employee-related tables:');
      employeeTables.forEach(t => console.log(`  - ${t.table_name}`));
    } else {
      console.log('\n⚠️  No employee-related tables found');
    }
    
    await db.destroy();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await db.destroy();
  }
}

listTables();

