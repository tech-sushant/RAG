import express from 'express';
import uploadRoute from './routes/uploadRoute.js';
import searchRoute from './routes/searchRoute.js';
import answerRoute from './routes/answerRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/upload', uploadRoute);
app.post('/search', searchRoute);
app.post('/answer', answerRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
  