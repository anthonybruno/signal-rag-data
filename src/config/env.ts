import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_EMBEDDING_MODEL: z.string().min(1),
  CHROMA_COLLECTION_NAME: z.string().min(1),
  COHERE_API_KEY: z.string().min(1),
  CHROMA_HOST: z.string().min(1),
  CHROMA_PORT: z.coerce.number().min(1),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function getEnv(): EnvConfig {
  // eslint-disable-next-line no-process-env
  return envSchema.parse(process.env);
}
