export interface RagQueryRequest {
  question: string;
  model?: string;
  k?: number;
  scoreThreshold?: number;
}

export interface RagQueryResponse {
  success: boolean;
  answer: string;
  analyzedQuery: {
    query: string;
    section: string;
  };
  context: Array<{
    content: string;
    metadata: Record<string, any>;
    score?: number;
  }>;
  metadata: {
    processingTime: number;
    model: string;
    timestamp: string;
    documentsRetrieved: number;
  };
}
