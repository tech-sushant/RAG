import { MarkdownTextSplitter } from '@langchain/textsplitters';

export async function recursiveChunk(text, chunkSize = 1000, chunkOverlap = 100) {
  const splitter = new MarkdownTextSplitter({ chunkSize, chunkOverlap });
  return await splitter.splitText(text);
}
