# 练习项目：AI 点子为什么空泛

这是第 2 章的独立练习项目，模拟 CanvasStorm 的 Project Brief 产品链路。

## 业务故障

用户写了项目背景并选择“先做 MVP”，但系统仍把增长、运营、长期平台化方案全部塞进执行草案。页面看起来很热闹，实际没有帮助用户做取舍，也没有把本次会话保存成可复盘的记录。

## 项目证据

- `frontend/ProjectBriefForm.jsx`：前端提交 Brief、方向和候选方案的最小界面。
- `server/briefPlanner.js`：产品链路逻辑，包含待定位故障。
- `evidence/network.json`：一次保存 Project Brief 的 Network 记录。
- `evidence/backend.log`：后端收到方向和候选的日志。
- `evidence/session-before.json`：保存前的会话。
- `evidence/session-after.json`：当前错误保存结果。
- `evidence/agent-delivery.md`：一份看起来完成但证据不足的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问其他项目。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/briefPlanner.broken.js server/briefPlanner.js
```

执行前请确认当前目录确实是 `sandbox/canvasstorm-product-brief`。
