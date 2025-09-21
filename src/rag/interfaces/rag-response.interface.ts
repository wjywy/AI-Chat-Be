export interface DocumentProcessResponse {
  success: boolean;
  message: string;
  documentId: string;
  chunksCount: number;
  processingTime: number;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  services: {
    queryAnalysis: string;
    vectorRetrieval: string;
    answerGeneration: string;
    documentProcessing: string;
  };
}
