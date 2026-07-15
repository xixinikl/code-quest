# 练习项目：事务、锁与一致性

这是 Java 后端路线第 2 关的独立练习项目，模拟事务熔炉：一次业务操作先写订单、再扣库存，却因为重复请求或中途失败留下半成品。

## 业务故障

请求需要稳定的幂等键，服务端需要在事务边界内完成核心写入，数据库还要用唯一约束兜底。重复请求不能重复扣库存；中途失败也不能留下只有订单、没有库存变化的半成品。

## 项目证据

- `frontend/SaveDraftButton.jsx`：前端下单和重复请求入口。
- `server/draftRepository.js`：后端事务/幂等逻辑，包含待定位故障。
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

执行前请确认当前目录确实是 `sandbox/java-transaction-consistency`。
