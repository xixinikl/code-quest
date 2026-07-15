# 练习项目：缓存为什么留下旧数据

这是 Java 后端路线第 3 关的独立练习项目，模拟缓存、数据库和异步刷新交错时的旧数据问题。

## 业务故障

用户刚修改了项目状态，却在下一次请求里读到旧版本。当前实现没有清楚记录缓存命中、TTL、数据库版本和异步刷新时间线。工程师必须先判断旧数据来自缓存、数据库还是尚未完成的异步任务。

## 项目证据

- `frontend/ProjectList.jsx`：客户端读取和展示状态的入口。
- `server/ProjectCacheService.java`：Java 服务的缓存读取逻辑，包含待定位边界。
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

执行前请确认当前目录确实是 `sandbox/java-cache-observability`。
