import { OpenAIEmbeddingFunction } from '@chroma-core/openai';

import { getEnv } from '@/config/env';

const env = getEnv();

export class Utils {
  /**
   * Generate embeddings for an array of documents using the OpenAI embedding model.
   *
   * @param {string[]} documents - The array of text documents to embed.
   * @returns {Promise<number[][]>} Embeddings for the input documents.
   */
  static async generateEmbedding(documents: string[]): Promise<number[][]> {
    const embeddingFunction = new OpenAIEmbeddingFunction({
      apiKey: env.OPENAI_API_KEY,
      modelName: env.OPENAI_EMBEDDING_MODEL,
    });

    const embeddings = await embeddingFunction.generate(documents);
    return embeddings;
  }
}
