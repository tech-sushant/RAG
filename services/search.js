import { OpenAIEmbeddings } from '@langchain/openai';
import { pool } from './db.js';

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-large',
  apiKey: process.env.OPENAI_API_KEY,
  dimensions: 2000,
});

export async function searchSimilarChunks(query, topK = 10) {
  try {
    const queryEmbedding = await embeddings.embedQuery(query);
    const vector = `[${queryEmbedding.join(',')}]`;

    const { rows } = await pool.query(
      `
      SELECT content, 1 - (embedding <=> $1::vector) AS similarity
      FROM documents
      WHERE embedding IS NOT NULL
      ORDER BY similarity DESC
      LIMIT $2
      `,
      [vector, topK]
    );

    return rows;
  } catch (error) {
    console.error('❌ Error in searchSimilarChunks:', error);
    throw error;
  }
}
