# 练习项目：信号风暴中的模型限流

这是第 4 章的延迟迁移复测。业务已经从 Project Brief 校验错误换成 AI 客服摘要批处理：客服主管提交了一批合法会话，上游模型却因容量限制返回 `429`，自有网关随后把它错误包装成没有上下文的 `500`。

## 事故现场

- 浏览器向 `/api/support-summaries/batches` 提交合法的会话批次。
- 自有 API 生成 `requestId`，再把会话交给模型供应商。
- 模型供应商返回 `429 MODEL_RATE_LIMITED` 和 `retry-after: 30`。
- 当前网关捕获异常后统一返回 `500 INTERNAL_ERROR`，丢掉了上游边界、重试时间和关联编号。
- 前端只能显示“系统错误”，值班工程师无法判断该改请求、查自有服务，还是等待上游恢复。

## 你要证明什么

1. 合法请求已经通过自有 API 的输入校验。
2. 自有 API 已经成功调用上游，而不是自己在调用前崩溃。
3. `429` 来自模型供应商；自有 API 应返回可行动的依赖不可用错误，并保留重试信息。
4. 修复后，错误响应、日志和测试必须用同一个 `requestId` 串起来。

## 固定材料

- `frontend/BatchSummaryPanel.jsx`：批量摘要提交与错误展示。
- `server/summaryRoutes.js`：当前网关路由，包含待定位故障。
- `server/providerClient.js`：上游模型调用边界。
- `evidence/network-batch-request.json`：浏览器合法请求。
- `evidence/network-generic-500.json`：自有 API 当前错误响应。
- `evidence/upstream-rate-limit.json`：模型供应商的 `429` 反证。
- `evidence/gateway.log`：包含 `requestId` 的网关日志。
- `evidence/retry-policy.md`：团队约定的上游限流处理规则。
- `evidence/agent-delivery.md`：缺少错误路径验证的 Agent 交付说明。

## 手动运行测试

应用不会执行命令。需要验证时，请在项目根目录手动运行：

```bash
npm test --prefix sandbox/model-rate-limit-retest
```

测试只使用 Node 内置模块，不联网、不访问其他项目。运行后会生成固定的 `test-results.json`，学习应用只读取这份报告。

## 恢复种子故障

需要恢复时请明确复制：

```bash
cp fixtures/summaryRoutes.broken.js server/summaryRoutes.js
```

执行前确认当前目录确实是 `sandbox/model-rate-limit-retest`。
