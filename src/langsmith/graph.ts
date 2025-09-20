// graph.ts
import 'dotenv/config';

import { ChatOpenAI } from '@langchain/openai';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { Tool } from '@langchain/core/tools';
// 或者使用社区里的工具，比如搜索工具
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
// import { TavilySearch } from '@langchain/tavily';

// LangSmith / Tracing 的 import
import { Client as LangSmithClient } from 'langsmith';
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain';

// 条件性创建 LangSmith 客户端和 tracer
// 避免在开发环境中与 NestJS LangSmith 集成冲突
let tracer: LangChainTracer | undefined;

// 只在生产环境或明确启用时创建 tracer
if (
  process.env.NODE_ENV === 'production' ||
  process.env.LANGSMITH_ENABLE_GRAPH_TRACING === 'true'
) {
  const langsmith = new LangSmithClient({
    apiKey: process.env.LANGCHAIN_API_KEY ?? '',
    // 如果需要 url 或 workspace id，可配置
    workspaceId: process.env?.LANGSMITH_WORKSPACE_ID,
  });

  tracer = new LangChainTracer({
    client: langsmith,
    projectName: 'my-langgraph-project',
  });
}

// 定义模型
const llm = new ChatOpenAI({
  temperature: 0,
  callbacks: tracer ? [tracer] : [], // 条件性添加 tracer
});

// 定义工具
const tools: Tool[] = [
  new TavilySearchResults({ maxResults: 3 }),
  // 可以加更多自定义工具
];

// 定义 checkpoint / memory，用来保持状态
const checkpointer = new MemorySaver();

// 创建 LangGraph agent 并导出为 graph
export const graph = createReactAgent({
  llm: llm,
  tools: tools,
  checkpointSaver: checkpointer,
});
