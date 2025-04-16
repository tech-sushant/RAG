import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { recursiveChunk } from '../services/chunker.js';
import { getEmbedding } from '../services/openaiClient.js';
import { insertEmbedding } from '../services/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function uploadRoute(req, res) {
  try {
    // Get filename from query or body
    const fileName = req.query.file || req.body.file;
    if (!fileName) {
      return res.status(400).json({ error: 'File name is required' });
    }

    const txtPath = path.join(__dirname, `../${fileName}`);
    if (!fs.existsSync(txtPath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const fullText = fs.readFileSync(txtPath, 'utf-8');

    // 2. Chunk it
    const chunks = await recursiveChunk(fullText);

    // 3. Optionally save chunks for review
    const timestamp = Date.now();
    const outputDir = path.join(__dirname, '..', 'output');
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `chunks_${timestamp}.txt`);
    const outputText = chunks.map((chunk, idx) =>
      `--- Chunk ${idx + 1} ---\n${chunk}\n`
    ).join('\n');
    fs.writeFileSync(outputPath, outputText);

    //4. Create and insert embeddings
    let i = 1;
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      console.log(`Created embedding ${i}/${chunks.length}`);
      await insertEmbedding({ content: chunk, embedding });
      i++;
    }

    res.json({
      message: 'Chunks from .txt processed and embedded',
      chunkCount: chunks.length,
      file: outputPath,
    });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
