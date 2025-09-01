import fs from 'fs';
import path from 'path';

import { OpenAIEmbeddingFunction } from '@chroma-core/openai';
import { ChromaClient } from 'chromadb';

import { getEnv } from '@/config/env';
import type * as Types from '@/types';
import { logger } from '@/utils/logger';

const env = getEnv();
const DATA_DIR = 'data';
const chromaClient = new ChromaClient({
  host: env.CHROMA_HOST,
  port: parseInt(env.CHROMA_PORT, 10),
});

/**
 * Flattens document data using a template for ChromaDB
 */
function flattenWithTemplate(data: Types.DocumentData): Types.FlattenedData {
  const { source, documentTemplate, documents } = data;

  const formatted: Types.FlattenedData = {
    ids: [],
    documents: [],
    metadatas: [],
  };

  documents.forEach((entry, index) => {
    const doc = documentTemplate.replace(
      /\$\{(\w+)\}/g,
      (_, key) => entry[key] as string,
    );
    formatted.ids.push(`${source}-${index + 1}`);
    formatted.documents.push(doc);
    formatted.metadatas.push({ source });
  });

  return formatted;
}

/**
 * Loads and processes all JSON data files from the data directory
 */
function loadAllData(): Types.FlattenedData {
  const all: Types.FlattenedData = {
    ids: [],
    documents: [],
    metadatas: [],
  };

  try {
    const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));

    files.forEach((file) => {
      try {
        const filePath = path.join(DATA_DIR, file);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const json: Types.DocumentData = JSON.parse(raw);

        const flattened = flattenWithTemplate(json);

        all.ids.push(...flattened.ids);
        all.documents.push(...flattened.documents);
        all.metadatas.push(...flattened.metadatas);

        console.log(`Loaded ${file} → ${flattened.ids.length} chunks`);
      } catch (error) {
        console.error(`Error loading ${file}:`, error);
      }
    });

    return all;
  } catch (error) {
    console.error('Error reading data directory:', error);
    throw error;
  }
}

/**
 * Initializes a new ChromaDB collection with OpenAI embeddings
 */
async function initializeChromaCollection(): Promise<void> {
  const heartbeat = await chromaClient.heartbeat();
  console.log('Heartbeat:', heartbeat);

  try {
    await chromaClient.deleteCollection({
      name: env.CHROMA_COLLECTION_NAME,
    });
    logger.info(`Deleted collection: ${env.CHROMA_COLLECTION_NAME}`);

    await chromaClient.createCollection({
      name: env.CHROMA_COLLECTION_NAME,
      embeddingFunction: new OpenAIEmbeddingFunction({
        apiKey: env.OPENAI_API_KEY,
        modelName: env.OPENAI_EMBEDDING_MODEL,
      }),
      configuration: {
        hnsw: {
          space: 'cosine',
          ef_construction: 200,
          ef_search: 200,
        },
      },
    });
  } catch (error) {
    logger.error('Error setting up ChromaDB collection:', error);
    throw error;
  }
}

/**
 * Adds flattened document data to the ChromaDB collection
 */
async function addDataToChroma(data: Types.FlattenedData): Promise<number> {
  try {
    const collection = await chromaClient.getCollection({
      name: env.CHROMA_COLLECTION_NAME,
    });

    await collection.add(data);
    const count = await collection.count();
    return count;
  } catch (error) {
    logger.error('Error adding data to ChromaDB:', error);
    throw error;
  }
}

/**
 * Creates and populates a ChromaDB collection with document data
 */
export async function createCollection() {
  try {
    logger.info('Loading data...');
    const allData = loadAllData();

    logger.info('Creating ChromaDB collection...');
    await initializeChromaCollection();

    logger.info('Adding data to collection...');
    const count = await addDataToChroma(allData);

    logger.info(`Collection has ${count} items`);
  } catch (error) {
    logger.error('Error creating collection:', error);
    process.exit(1);
  }
}
