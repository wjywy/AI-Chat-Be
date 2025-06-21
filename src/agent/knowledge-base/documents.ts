export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  metadata?: Record<string, any>;
}

export const KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: '1',
    title: 'AI与机器学习基础',
    category: 'AI',
    content: `
人工智能（AI）是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统。
机器学习是AI的一个子集，它使计算机能够在没有明确编程的情况下学习和改进。
深度学习是机器学习的一个子集，使用神经网络来模拟人脑的工作方式。
常见的机器学习算法包括：线性回归、决策树、随机森林、支持向量机、神经网络等。
    `,
  },
  {
    id: '2',
    title: 'LangChain框架介绍',
    category: 'LangChain',
    content: `
LangChain是一个用于构建基于大型语言模型（LLM）应用程序的框架。
它提供了模块化的组件，包括：
- Prompts: 用于格式化和管理提示模板
- Models: 与各种LLM提供商的集成
- Chains: 将多个组件链接在一起的工具
- Agents: 能够使用工具并根据观察结果做出决策的实体
- Memory: 在链或代理调用之间持久化状态
- Retrievers: 用于检索相关文档的接口
    `,
  },
  {
    id: '3',
    title: 'NestJS框架特性',
    category: 'NestJS',
    content: `
NestJS是一个用于构建高效、可扩展的Node.js服务器端应用程序的框架。
主要特性包括：
- 基于TypeScript构建，提供强类型支持
- 使用装饰器和依赖注入
- 模块化架构
- 内置支持WebSocket、微服务、GraphQL等
- 强大的CLI工具
- 与Express和Fastify兼容
- 内置测试工具和文档生成
    `,
  },
  {
    id: '4',
    title: 'RAG系统原理',
    category: 'RAG',
    content: `
RAG（Retrieval Augmented Generation）是一种结合检索和生成的AI技术。
工作原理：
1. 文档索引：将知识库文档转换为向量并存储
2. 查询处理：将用户查询转换为向量
3. 相似性搜索：在向量数据库中找到最相关的文档
4. 上下文增强：将检索到的文档作为上下文
5. 生成回答：LLM基于上下文生成准确的回答

RAG的优势：
- 提供准确、最新的信息
- 减少幻觉问题
- 可追溯信息来源
- 支持领域特定知识
    `,
  },
  {
    id: '5',
    title: '聊天机器人设计原则',
    category: 'Chatbot',
    content: `
设计优秀聊天机器人的关键原则：
1. 用户体验优先：界面简洁、响应快速、交互自然
2. 上下文理解：维护对话历史，理解用户意图
3. 个性化：根据用户偏好调整回答风格
4. 错误处理：优雅处理无法理解的输入
5. 多模态支持：文本、语音、图像等多种交互方式
6. 安全性：内容过滤、隐私保护
7. 可扩展性：模块化设计，易于添加新功能
8. 监控和分析：收集使用数据，持续优化
    `,
  },
];
