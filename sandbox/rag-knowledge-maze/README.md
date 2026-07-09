# 练习项目：RAG 知识库

这是第 9 章的独立练习项目，模拟 CanvasStorm 的知识迷宫：AI 不是凭空知道项目资料，而是要先把文档切成 chunk、建立索引、检索命中，再把命中的资料带进回答。

## 业务故障

当前实现把文档简单按固定长度切开，丢失标题和来源路径；查询时也没有真正按问题语义检索，而是直接取前几个 chunk。最终回答没有展示 matches、score 和来源，用户不知道答案到底来自哪页资料。

## 项目证据

- `frontend/RagAnswerPanel.jsx`：前端展示 RAG 回答，但缺少命中资料和来源。
- `server/ragEngine.js`：文档切分、索引、检索和回答拼接逻辑，包含待定位故障。
- `evidence/source-docs.json`：原始项目文档。
- `evidence/chunk-index.json`：当前错误索引记录。
- `evidence/search-miss.json`：问题命中错误资料的反例。
- `evidence/network-rag-answer.json`：浏览器可见的 RAG 请求和响应。
- `evidence/backend.log`：后端日志显示 topK 和来源缺失。
- `evidence/agent-delivery.md`：一份看似完成 RAG，但没有证明检索命中的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问真实向量库。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/ragEngine.broken.js server/ragEngine.js
```

执行前请确认当前目录确实是 `sandbox/rag-knowledge-maze`。
