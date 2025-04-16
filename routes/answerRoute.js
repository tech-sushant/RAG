import { generateAnswer } from '../services/answer.js';

export default async function answerRoute(req, res) {
  try {
    const { query, chunks } = req.body;
    if (!query || !chunks) {
      return res.status(400).json({ error: 'Query and chunks are required' });
    }

    // Use the answer service to generate the answer
    const answer = await generateAnswer(query, chunks);
    res.json({ answer });
  } catch (err) {
    console.error('❌ Error generating answer:', err);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
}
