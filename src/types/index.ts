export interface DocumentData {
  source: string;
  documentTemplate: string;
  documents: Record<string, string | number | boolean>[];
}

export interface FlattenedData {
  ids: string[];
  documents: string[];
  metadatas: { source: string }[];
}

export interface ChromaConfig {
  collectionName: string;
  apiKey: string;
  modelName: string;
  hnswSpace: 'cosine' | 'l2' | 'ip';
  efConstruction: number;
  efSearch: number;
}
