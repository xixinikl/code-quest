# 练习项目：首屏为什么慢

这是前端工程路线第 3 关的独立练习项目，模拟首屏观测塔：用户打开项目列表时一直转圈，第二次打开也没有变快，滚动列表还会卡。

## 业务故障

当前实现把“慢”混在一起了：资源、接口和渲染都没有清晰的时间证据。用户看到的只是“页面慢”，但工程师必须先判断时间花在资源下载、接口等待，还是一次性渲染太多项目。

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

执行前请确认当前目录确实是 `sandbox/frontend-performance-proof`。
