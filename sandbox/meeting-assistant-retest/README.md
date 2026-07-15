# AI 会议助手延迟变式复测

这是第 2 章 CanvasStorm 产品链路实战的延迟变式案件。业务、文件、候选方案和证据均已更换，用于检查能否迁移 Project Brief、候选取舍和会话保存方法。

## 现象

- 委托人只说“做一个更聪明的会议助手”。
- 页面显示已经选择“行动项摘要”，刷新后却恢复为未选择。
- 候选列表还混入了当前阶段不需要的实时数字人方案。

## 手动流程

1. 先阅读 `evidence/product-request.json` 和 `evidence/candidate-set.json`。
2. 再比较 `evidence/session-after-refresh.json` 与 `server/meetingPlanner.js`。
3. 只修改允许范围内的 `server/meetingPlanner.js`。
4. 手动运行：

```bash
cd sandbox/meeting-assistant-retest
npm test
```

测试会把结果写入 `test-results.json`。学习应用只读取报告，不会替你执行命令。
