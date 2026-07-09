# 练习项目：接口为什么报错

这是第 4 章的独立练习项目，模拟 CanvasStorm 的接口审判庭：前端提交 Project Brief 时接口报错，但页面只说“提交失败”。

## 业务故障

用户没有填写 `userGoal`，前端仍然把请求发给 `/api/briefs`。后端明明可以判断这是请求体缺字段，却把它包装成 500，并且响应体没有字段级错误；前端也只显示泛泛提示。结果用户不知道是自己少填了目标，开发者也不能从 Network 和日志里快速定位。

## 项目证据

- `frontend/BriefSubmitButton.jsx`：前端提交按钮和错误提示逻辑。
- `server/briefRoutes.js`：接口处理和校验逻辑，包含待定位故障。
- `evidence/network-invalid-payload.json`：缺少 `userGoal` 的请求体。
- `evidence/network-500-response.json`：当前错误实现返回的 500 响应。
- `evidence/backend.log`：后端日志把可预期校验错误记成了内部异常。
- `evidence/agent-delivery.md`：一份看似完成但缺少错误路径验收的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问其他项目。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/briefRoutes.broken.js server/briefRoutes.js
```

执行前请确认当前目录确实是 `sandbox/api-error-court`。
