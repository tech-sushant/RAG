import { searchSimilarChunks } from '../services/search.js';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

export default async function searchRoute(req, res) {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const results = await searchSimilarChunks(query);

    const documents = results.map((item) => item.content);
    
    console.log("Initial Chunks",documents);
    
    const rerankResponse = await cohere.v2.rerank({
      documents:documents,
      query:query,
      topN: 5,
      model: 'rerank-v3.5',
    });

    const rerankedResults = rerankResponse.results.map((result) => ({
      content: documents[result.index],
      similarity: result.relevanceScore,
    }));

    console.log("Reranked Results",rerankedResults);
    
    res.json({ results: rerankedResults });
    
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
}
