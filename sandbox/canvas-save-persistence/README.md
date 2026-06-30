# 练习项目：保存成功，但刷新后消失

这是独立练习项目，不读取、不依赖 CanvasStorm。

## 业务故障

用户点击“保存画布”后收到 `201 Created`，当前页面也显示画布；刷新页面后，刚才保存的画布消失。

## 项目证据

- `frontend/SaveCanvasButton.jsx`：前端保存逻辑。
- `server/canvasRoutes.js`：后端 API 路由。
- `server/canvasRepository.js`：数据访问层，包含待定位故障。
- `database/schema.sql`：SQLite 表结构。
- `evidence/`：Network、后端日志、数据库查询和 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块和内存数据库，不联网、不访问其他项目。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/canvasRepository.broken.js server/canvasRepository.js
```

执行前请确认当前目录确实是 `sandbox/canvas-save-persistence`。
