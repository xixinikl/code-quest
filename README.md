# 码上冒险

一个面向 AI 应用开发求职方向的工程师成长 RPG。用户通过真实项目委托，练习接手代码、定位问题、指挥 Agent、验证交付，并沉淀可用于面试复盘的项目经历。

它不再使用明显的单选题、基线诊断页面或 localStorage 小课。首个主线任务要求用户在引导下阅读独立项目代码、Network、日志和 SQLite 证据，在自己的编辑器中修复故障，并手动运行测试。

## 启动

要求 Node.js 22.5+。项目使用 Node 内置 SQLite，不需要安装数据库服务器。

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址。学习记录保存在 `.data/code-quest.sqlite`。服务只监听本机，不读取或上传真实项目内容，也不会替用户执行终端命令。

## 首个主线任务

练习项目位于：

```text
sandbox/canvas-save-persistence
```

当应用进入“真实修复与测试”阶段后，在该目录手动运行：

```bash
npm test
```

应用只读取生成的 `test-results.json`；它不会运行这条命令。

## 验证

```bash
npm run verify
```

该命令依次执行格式检查、Lint、TypeScript、测试和生产构建。

## 产品边界

当前纵向切片包含 AI 应用开发职业路线入口、15 章主线卷轴、真实项目材料、引导式项目地图、关键概念教学、分级陪练、独立沙盒、手动测试报告、SQLite 学习记录和成长档案。详细学习边界仍见 `docs/v2-learning-contract.md`。

长期路线事实源在 `src/careerRoadmap.ts`。它覆盖产品链路、登录态、接口错误、数据一致性、性能、AI API、幻觉控制、RAG、Agent 工具调用、测试验收、上线检查和面试复盘。当前第 2 章已经能从章节卷宗直接进入 CanvasStorm 产品链路教学，并接入 `sandbox/canvasstorm-product-brief` 专属实战 Lab；第 3 章已经能从章节卷宗进入身份回廊教学，并接入 `sandbox/identity-session-corridor` 专属实战 Lab；第 4 章已经能从章节卷宗进入接口审判庭教学，并接入 `sandbox/api-error-court` 专属实战 Lab；第 5 章已经能从章节卷宗进入一致性熔炉教学，并接入 `sandbox/data-consistency-forge` 专属实战 Lab；第 6 章已经能从章节卷宗进入慢速迷雾教学，并接入 `sandbox/performance-fog-lab` 专属实战 Lab；第 7 章已经能从章节卷宗进入模型熔炉教学，并接入 `sandbox/ai-api-key-vault` 专属实战 Lab；第 8 章已经能从章节卷宗进入幻觉镜厅教学，并接入 `sandbox/hallucination-mirror-hall` 专属实战 Lab；第 9 章已经能从章节卷宗进入知识迷宫教学，并接入 `sandbox/rag-knowledge-maze` 专属实战 Lab；第 10 章已经能从章节卷宗进入工具契约大厅教学，并接入 `sandbox/agent-tool-tower` 专属实战 Lab；第 11 章已经能从章节卷宗进入验收试炼场教学，并接入 `sandbox/verification-trial-arena` 专属实战 Lab；第 12 章已经能从章节卷宗进入委托书工坊教学，并接入 `sandbox/agent-brief-forge` 专属实战 Lab；第 13 章已经能从章节卷宗进入交付审查庭教学，并接入 `sandbox/delivery-review-court` 专属实战 Lab；第 14 章已经能从章节卷宗进入上线前夜教学，并接入 `sandbox/release-readiness-gate` 专属实战 Lab；第 15 章已经能从章节卷宗进入终章答辩厅教学，并接入 `sandbox/interview-answer-forge` 专属实战 Lab。路线层已抽成 `careerRoutes`，首页用简单岗位令牌展示 AI 应用开发可进入、Java 后端和前端工程即将解锁。第 1-15 章已接完整 UI 实战闭环，能覆盖从读项目、定位问题、Agent 协作、交付审查、上线检查到面试复盘的主线训练；自动化只能证明工程路径可用，不能冒充真人学习效果已完成。后续岗位路线必须按用户选择加载自己的关卡，目标是训练到能独立处理工作问题、验收 Agent 交付、准备上线和回答面试追问。

每章路线还配置了伙伴、宠物或装备解锁物，用来把学习收获做成更像 RPG 的收集目标。首页任务简报已展示“伙伴图鉴”“伙伴背包”和“面试复盘册”；章节教学完成后会出现暗色 RPG 结算页，记录已通关章节和已解锁角色。背包可筛选全部、已收集和可获取对象，并展示对应能力印记、工作场景和面试复盘；复盘册会把每章整理成现象、定位证据、行动/修改、验证动作和可迁移经验，并可进入独立复盘房间填写自己的五段回答。复盘草稿保存到本地 SQLite 学习记录，作品集页可把 15 章路线素材和用户复盘草稿生成可复制 Markdown；本地备份库可导出/恢复 SQLite 学习记录和成长档案 JSON。这些内容不上传真实项目或个人信息。

教学桥后半段也保持暗色 RPG 视觉。代码导读不会一次甩完整文件，而是先给阅读罗盘和流程位置，再展示关键行、逐行翻译、证据边界和可交给 Agent 的检查话术。

## 当前任务入口

AI 职业 RPG 的工程化任务清单见 `docs/ai-career-rpg-tasks.md`。旧的 `docs/guided-learning-tasks.md` 只作为引导式教学桥的历史实施清单保留。

## 后续开发交接

当前 `main` 作为冻结审查基线。AI 职业 RPG 后续开发入口、分支规则和阅读顺序见 `HANDOFF.md`；当前任务事实源见 `docs/ai-career-rpg-tasks.md`。
