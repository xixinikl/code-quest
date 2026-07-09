# 练习项目：数据为什么重复/错乱

这是第 5 章的独立练习项目，模拟 CanvasStorm 的一致性熔炉：用户只想保存一次草稿，却因为连点、重试或后端半失败写出多份记录。

## 业务故障

前端按钮没有稳定的幂等键，后端也没有用 `Idempotency-Key` 或 `clientMutationId` 做唯一约束。用户连点两次时，数据库出现两条内容相同的草稿。更糟的是，如果后续写审计日志失败，草稿已经被插入，系统留下半截数据。

## 项目证据

- `frontend/SaveDraftButton.jsx`：前端保存按钮和重复点击入口。
- `server/draftRepository.js`：后端保存逻辑，包含待定位故障。
- `evidence/network-double-submit.json`：两次重复提交的 Network 记录。
- `evidence/database-before.json`：保存前数据库状态。
- `evidence/database-after.json`：当前错误实现写出的重复记录。
- `evidence/backend.log`：后端日志显示重复请求和半截写入。
- `evidence/agent-delivery.md`：一份看似完成但没有证明幂等和事务边界的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问其他项目。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/draftRepository.broken.js server/draftRepository.js
```

执行前请确认当前目录确实是 `sandbox/data-consistency-forge`。
