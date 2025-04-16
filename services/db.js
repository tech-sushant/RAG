import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'sushant',
  host: 'localhost',
  database: 'ragdb',
  password: '',
  port: 5432,
});

export async function insertEmbedding({ content, embedding }) {
  const vector = `[${embedding.join(',')}]`;
  await pool.query(
    'INSERT INTO documents (content, embedding) VALUES ($1, $2::vector)',
    [content, vector]
  );  
}   

export { pool };
