# 练习项目：Agent 工具调用

这是第 10 章的独立练习项目，模拟 CanvasStorm 的 Agent 高塔：Agent 想调用工具帮用户查资料、创建任务或更新状态，但每一次工具调用都必须经过注册表、参数校验、权限检查和失败回退。

## 业务故障

当前实现只要收到 `toolName` 和 `args` 就直接执行。它没有严格检查参数类型和枚举值，也没有按用户权限拦截危险动作。工具失败时还会把内部错误直接丢给前端，用户不知道下一步该怎么做。

## 项目证据

- `frontend/AgentToolConsole.jsx`：前端展示 Agent 工具调用结果，但没有区分成功、越权和失败回退。
- `server/agentTools.js`：工具注册表和执行器，包含待定位故障。
- `evidence/tool-registry.json`：当前工具注册表。
- `evidence/network-tool-call.json`：浏览器可见的工具调用请求。
- `evidence/permission-denied.json`：越权调用却被执行的反例。
- `evidence/tool-failure.json`：工具失败时返回不可读错误的证据。
- `evidence/backend.log`：后端日志显示缺失参数校验和审计信息。
- `evidence/agent-delivery.md`：一份看似接入工具，但没有证明边界的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问真实系统。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/agentTools.broken.js server/agentTools.js
```

执行前请确认当前目录确实是 `sandbox/agent-tool-tower`。
