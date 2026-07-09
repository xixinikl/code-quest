# 练习项目：AI 回复为什么胡说

这是第 8 章的独立练习项目，模拟 CanvasStorm 的幻觉镜厅：AI 回答看起来很顺，但没有引用来源，甚至在资料不足时也会编出结论。

## 业务故障

当前实现只把用户问题直接交给模型，没有把资料范围、引用要求和拒答边界写进 Prompt。模型返回答案后，服务端也没有校验 `citations` 是否来自本轮上下文。结果是：有资料时引用可能是假的；无资料时模型仍然硬答。

## 项目证据

- `frontend/GroundedAnswerPanel.jsx`：前端展示 AI 回答，但没有清楚展示引用和低置信提示。
- `server/groundedAnswer.js`：构造 Prompt、调用模型和校验答案的逻辑，包含待定位故障。
- `evidence/context-chunks.json`：本轮允许使用的资料片段。
- `evidence/model-answer-unsupported.json`：模型编造引用的原始输出。
- `evidence/no-context-answer.json`：无资料时仍然硬答的反例。
- `evidence/network-grounded-answer.json`：浏览器可见的问答请求记录。
- `evidence/backend.log`：后端日志显示引用校验缺失。
- `evidence/agent-delivery.md`：一份看似优化 Prompt、但没有反例测试的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问真实 AI 服务。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/groundedAnswer.broken.js server/groundedAnswer.js
```

执行前请确认当前目录确实是 `sandbox/hallucination-mirror-hall`。
