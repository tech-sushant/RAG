import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAnswer(query, chunks) {
  try {
    const prompt = `
      You are a helpful assistant.

      Please read and analyze this data to provide a clear and concise answer to the question. Your response should based on the provided data. Do not include any information not present in the data.
    
      Data:
      ${chunks.join('\n\n')}
    
      Answer the question based on the above data:
      "${query}"
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error('Error generating answer:', err);
    throw new Error('Failed to generate answer');
  }
}