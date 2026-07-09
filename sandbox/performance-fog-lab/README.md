# 练习项目：页面为什么慢

这是第 6 章的独立练习项目，模拟 CanvasStorm 的慢速迷雾：用户打开项目列表时，页面一直转圈，刷新第二次也不快，滚动列表还会卡。

## 业务故障

当前实现把“慢”混在一起了：后端没有返回清楚的计时证据，列表请求每次都查数据库，没有缓存命中记录，前端还一次性渲染所有项目。用户看到的只是“页面慢”，但工程师必须先判断时间花在接口等待、数据库查询、缓存缺失，还是前端渲染。

## 项目证据

- `frontend/ProjectList.jsx`：项目列表页的加载、计时和渲染入口。
- `server/projectPerformance.js`：后端项目列表查询逻辑，包含待定位故障。
- `evidence/network-waterfall.json`：首屏 Network 瀑布图记录。
- `evidence/backend.log`：后端查询耗时和缓存缺失日志。
- `evidence/render-profile.json`：前端一次性渲染过多列表的证据。
- `evidence/cache-retest.json`：第二次访问仍然没有变快的复测记录。
- `evidence/agent-delivery.md`：一份看似完成但没有证明性能瓶颈的 Agent 交付说明。

## 手动运行测试

应用不会替你运行命令。需要验证时，由你在此目录亲自执行：

```bash
npm test
```

测试只使用 Node 内置模块，不联网、不访问其他项目。运行后会在本目录生成 `test-results.json`，学习应用只读取这个固定报告。

## 恢复种子故障

应用不会自动删除或覆盖你的文件。需要恢复时，请明确地复制：

```bash
cp fixtures/projectPerformance.broken.js server/projectPerformance.js
```

执行前请确认当前目录确实是 `sandbox/performance-fog-lab`。
