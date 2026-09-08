import pg from 'pg';

const connectionString = 'postgresql://postgres:bdwx13elgrqryoe3@187.127.233.89:5441/postgres';

const pool = new pg.Pool({
  connectionString,
  ssl: false
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL at 187.127.233.89:5441!');
    const res = await client.query('SELECT NOW(), version()');
    console.log('DB Output:', res.rows[0]);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.message);
    process.exit(1);
  }
}

testConnection();
