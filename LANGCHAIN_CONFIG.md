# LangSmith 和 LangGraph 配置指南

本文档介绍如何在项目中配置和使用 LangSmith 和 LangGraph。

## 环境变量配置

### LangSmith 配置

在 `src/.env` 文件中配置以下环境变量：

```env
# LangSmith 相关配置
LANGSMITH_API_KEY=your_langsmith_api_key_here  # 必需：LangSmith API 密钥
LANGSMITH_API_URL=https://api.smith.langchain.com  # 可选：API 地址
LANGSMITH_PROJECT_NAME=ai-chat-project  # 可选：项目名称
LANGSMITH_TRACING=true  # 可选：是否启用追踪
```

### LangGraph 配置

```env
# LangGraph 相关配置
LANGGRAPH_ENABLE_CHECKPOINTING=true  # 可选：是否启用检查点
LANGGRAPH_DEFAULT_WORKFLOW_TIMEOUT=300000  # 可选：默认工作流超时时间（毫秒）
```

## 获取 LangSmith API 密钥

1. 访问 [LangSmith 官网](https://smith.langchain.com/)
2. 注册或登录账户
3. 在设置页面创建 API 密钥
4. 将密钥复制到环境变量中

## 功能特性

### LangSmith 功能

- **自动追踪**：使用装饰器自动追踪方法调用
- **LLM 调用记录**：记录所有 LLM 交互
- **工具调用追踪**：监控工具使用情况
- **数据集管理**：创建和管理测试数据集
- **性能监控**：实时监控应用性能

### LangGraph 功能

- **工作流构建**：创建复杂的 AI 工作流
- **状态管理**：管理工作流状态
- **条件分支**：支持条件逻辑
- **流式处理**：支持流式执行
- **检查点**：支持工作流检查点和恢复

## 使用示例

### 使用 LangSmith 追踪
待补充

### 使用 LangGraph 创建工作流
待补充

## 注意事项

1. **API 密钥安全**：请妥善保管 LangSmith API 密钥，不要提交到版本控制系统
2. **网络连接**：确保服务器能够访问 LangSmith API
3. **性能影响**：追踪功能可能会对性能产生轻微影响
4. **存储空间**：LangSmith 会存储追踪数据，注意存储配额

## 故障排除

### 常见问题

1. **API 密钥无效**
   - 检查密钥是否正确
   - 确认密钥是否已激活

2. **网络连接问题**
   - 检查网络连接
   - 确认防火墙设置

3. **追踪数据未显示**
   - 检查项目名称配置
   - 确认追踪功能已启用

### 调试模式

启用调试日志：

```env
LOG_LEVEL=debug
```

这将输出详细的调试信息，帮助诊断问题。

## 更多资源

- [LangSmith 文档](https://docs.smith.langchain.com/)
- [LangGraph 文档](https://langchain-ai.github.io/langgraph/)
- [LangChain 社区](https://github.com/langchain-ai/langchain)