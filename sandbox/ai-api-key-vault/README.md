# 练习项目：AI 接口怎么接

这是第 7 章的独立练习项目，模拟 CanvasStorm 的模型熔炉：用户想在页面里调用 AI 生成内容，但当前实现把密钥、请求边界和失败路径都混在一起了。

## 业务故障

前端组件里出现了演示密钥，还直接把 `Authorization` 放进浏览器可见的请求。后端接口也会信任前端传来的 `apiKey`，失败时把敏感调试信息返回给页面。成功路径一次性返回完整文本，没有给前端稳定的流式片段。

## 项目证据

- `frontend/AiChatPanel.jsx`：前端 AI 输入框和错误的密钥使用方式。
- `server/aiGateway.js`：后端 AI 转发逻辑，包含待定位故障。
- `evidence/frontend-bundle-scan.json`：前端包扫描到密钥和 Authorization 的证据。
- `evidence/network-chat.json`：浏览器可见的 AI 请求记录。
- `evidence/provider-error.json`：上游失败时返回给前端的错误体。
- `evidence/stream-trace.json`：当前没有真正流式返回的证据。
- `evidence/backend.log`：后端日志显示密钥边界和失败信息。
- `evidence/agent-delivery.md`：一份看似接入 AI，但没有证明密钥安全和失败兜底的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问真实 AI 服务。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/aiGateway.broken.js server/aiGateway.js
```

执行前请确认当前目录确实是 `sandbox/ai-api-key-vault`。
