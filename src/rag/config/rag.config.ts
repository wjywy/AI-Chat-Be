import { registerAs } from '@nestjs/config';

export default registerAs('rag', () => ({
  // LangChain配置
  langchain: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    model: process.env.RAG_MODEL || 'gpt-3.5-turbo',
    temperature: parseFloat(process.env.RAG_TEMPERATURE || '0.1'),
    maxTokens: parseInt(process.env.RAG_MAX_TOKENS || '1000'),
  },

  // 向量数据库配置
  vectorDb: {
    type: process.env.VECTOR_DB_TYPE || 'chroma',
    chromaUrl: process.env.CHROMA_URL || 'http://localhost:8000',
    collectionName: process.env.CHROMA_COLLECTION || 'rag_documents',
  },

  // 文档处理配置
  document: {
    chunkSize: parseInt(process.env.CHUNK_SIZE || '1000'),
    chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '200'),
    maxDocumentSize: parseInt(process.env.MAX_DOCUMENT_SIZE || '10485760'), // 10MB
  },

  // 检索配置
  retrieval: {
    topK: parseInt(process.env.RETRIEVAL_TOP_K || '5'),
    similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD || '0.7'),
  },

  // 查询分析配置
  queryAnalysis: {
    enableQueryRewrite: process.env.ENABLE_QUERY_REWRITE === 'true',
    enableSectionFilter: process.env.ENABLE_SECTION_FILTER === 'true',
  },
}));
