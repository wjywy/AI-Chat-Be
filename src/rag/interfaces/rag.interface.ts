export interface RagQueryRequest {
  question: string;
  user_id?: string;
  model?: string;
  section?: string;
  top_k?: number;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  context?: {
    conversation_id?: string;
    previous_messages?: Array<{
      role: 'user' | 'assistant';
      content: string;
      timestamp: Date;
    }>;
  };
  filters?: {
    document_types?: string[];
    date_range?: {
      start: Date;
      end: Date;
    };
    tags?: string[];
  };
}

export interface RagQueryResponse {
  answer: string;
  context_documents: ContextDocument[];
  metadata: {
    query_id?: string;
    processing_time?: number;
    model_used?: string;
    confidence_score?: number;
    sources_count?: number;
    analysis_result?: any;
    quality_score?: number;
    workflow_type?: string;
    error?: boolean;
    error_message?: string;
  };
  timestamp: Date;
  follow_up_questions?: string[];
  summary?: string;
}

export interface ContextDocument {
  id: string;
  title: string;
  content: string;
  url?: string;
  section?: string;
  relevance_score: number;
  chunk_index?: number;
  metadata?: {
    file_name?: string;
    file_type?: string;
    created_at?: Date;
    updated_at?: Date;
    tags?: string[];
  };
}

export interface QueryAnalysisResult {
  intent:
    | 'information_seeking'
    | 'comparison'
    | 'explanation'
    | 'how_to'
    | 'troubleshooting'
    | 'other';
  complexity: 'simple' | 'medium' | 'complex';
  keywords: string[];
  section?: string;
  rewritten_query?: string;
  confidence: number;
  entities?: {
    type: string;
    value: string;
    confidence: number;
  }[];
  topics?: string[];
  language?: string;
}

export interface VectorSearchOptions {
  section?: string;
  topK?: number;
  threshold?: number;
  filters?: Record<string, any>;
  includeMetadata?: boolean;
}

export interface VectorSearchResult {
  chunks: RetrievedChunk[];
  total_found: number;
  search_time: number;
  metadata?: {
    search_type: 'similarity' | 'hybrid' | 'keyword';
    query_embedding?: number[];
    filters_applied?: Record<string, any>;
  };
}

export interface RetrievedChunk {
  id: string;
  document_id: string;
  content: string;
  relevance_score: number;
  chunk_index: number;
  document_title?: string;
  document_url?: string;
  section?: string;
  metadata?: {
    file_name?: string;
    file_type?: string;
    created_at?: Date;
    tags?: string[];
  };
}

export interface AnswerGenerationOptions {
  query: string;
  chunks: RetrievedChunk[];
  analysisResult?: QueryAnalysisResult;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  includeFollowUp?: boolean;
  includeSummary?: boolean;
}

export interface DocumentProcessingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  separators?: string[];
  preserveFormatting?: boolean;
  extractMetadata?: boolean;
}

export interface DocumentChunk {
  id?: string;
  document_id: string;
  content: string;
  chunk_index: number;
  start_char?: number;
  end_char?: number;
  metadata?: {
    section?: string;
    headers?: string[];
    page_number?: number;
    [key: string]: any;
  };
}

export interface EmbeddingOptions {
  model?: string;
  dimensions?: number;
  batchSize?: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    vector_store: {
      status: string;
      collection_count?: number;
      document_count?: number;
    };
    document_management: {
      total_documents: number;
      total_chunks: number;
    };
    query_analysis: {
      status: string;
    };
    answer_generation: {
      status: string;
    };
  };
  error?: string;
}

export interface SystemStats {
  total_queries: number;
  total_results: number;
  total_documents: number;
  total_chunks: number;
  avg_processing_time: number;
  avg_relevance_score?: number;
  most_common_intents?: Array<{
    intent: string;
    count: number;
  }>;
  recent_activity?: {
    queries_last_24h: number;
    documents_added_last_24h: number;
  };
}

export interface SearchParams {
  query: string;
  k?: number;
  topK?: number;
  section?: string;
  filter?: Record<string, any>;
  searchType?: 'similarity' | 'hybrid' | 'keyword';
  threshold?: number;
}

export interface WorkflowState {
  query_id: string;
  current_step: string;
  steps_completed: string[];
  context: Record<string, any>;
  error?: string;
  started_at: Date;
  updated_at: Date;
}

export interface GraphWorkflowResult {
  final_answer: RagQueryResponse;
  workflow_trace: Array<{
    step: string;
    input: any;
    output: any;
    duration: number;
    timestamp: Date;
  }>;
  total_duration: number;
  success: boolean;
  error?: string;
}
