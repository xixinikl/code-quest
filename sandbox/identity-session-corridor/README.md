# 练习项目：登录状态为什么丢

这是第 3 章的独立练习项目，模拟 CanvasStorm 的身份回廊：用户登录成功后刷新页面，却又变成游客。

## 业务故障

登录接口返回 200，页面也短暂显示用户名；但凭证只停在本次内存里，没有进入浏览器 Cookie 或本地持久化，也没有在服务端会话登记册里落档。刷新后前端不知道“我是谁”，访问 `/api/me` 又没有携带有效凭证，于是后端返回 401。

## 项目证据

- `frontend/LoginGate.jsx`：前端登录入口和刷新恢复逻辑。
- `server/sessionGateway.js`：身份会话逻辑，包含待定位故障。
- `evidence/network-login.json`：登录请求 200，但响应头没有可恢复凭证。
- `evidence/network-me-401.json`：刷新后请求 `/api/me` 返回 401。
- `evidence/browser-storage-before.json`：登录前浏览器凭证为空。
- `evidence/browser-storage-after.json`：当前错误实现登录后仍没有持久凭证。
- `evidence/backend.log`：后端日志显示会话没有落档、后续请求缺凭证。
- `evidence/agent-delivery.md`：一份看起来完成但没有证明刷新恢复的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问其他项目。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/sessionGateway.broken.js server/sessionGateway.js
```

执行前请确认当前目录确实是 `sandbox/identity-session-corridor`。
