# AI 职业 RPG 工程化任务入口

本文件是当前 `code-quest` 的任务事实源，覆盖“AI 应用开发职业路线 + 游戏化闯关 + 求职能力沉淀”这条产品线。

旧的 `docs/guided-learning-tasks.md` 仍保留为“引导式教学桥”的历史实施清单；后续如果讨论首页、岗位路线、关卡扩展、可玩性和求职转化，以本文件为准。

## 规范模式启动卡

- 模式：`standard-project-workflow` L 级。
- 目标：让用户打开应用后，能像玩 RPG 主线一样学习 AI 应用开发；这不是两个关卡的演示，而是一条长期职业训练路线，最终训练到可以独立面对工作问题、独立验收 Agent 交付、独立组织面试复盘，并能回答面试追问。
- 范围：AI 应用开发路线优先；Java 后端、前端工程只作为后续路线入口，不在当前切片展开。
- 不做：不接入外部 AI API、不上传真实项目、不执行用户终端命令、不宣称真人学习效果已验证。
- 完成标准：15 章路线目标清晰、关卡路径可理解、每章最终都有剧情教学 + 真实材料 + 操作练习 + 求职复盘 + 验收证据，旧 V1 体验清除，工程验证通过，真实用户试玩后再判断学习效果。

## 产品判断

### 用户目标

用户不是为了刷题，而是为了找工作和提高真实开发能力。他需要：

- 看懂 Agent 给出的开发解释；
- 知道一个项目从需求到验收怎么推进；
- 能提出更好的任务；
- 能判断 Agent 的交付是否可信；
- 最终能讲出一段面试官听得懂的项目复盘。

### 总目标

这条路线不能停在两个关卡。它要逐步覆盖初级 AI 应用开发者在真实工作里会遇到的基础问题：需求不清、请求链路断裂、登录态丢失、接口报错、数据重复、页面变慢、AI API 接入、模型幻觉、RAG 检索、Agent 工具调用、测试验收、任务委托、交付审查、上线风险和面试表达。

长期验收口径：用户不是“看完课程”，而是逐章练出工作肌肉。第 1 章教会他看请求和数据是否真的保存；第 2 章教会他把模糊 AI 点子拆成产品链路；后续章节继续训练登录态、接口、数据一致性、性能、AI API、RAG、Agent、测试、交付、上线和面试。每章都要能回答“我在真实工作里会怎么用它”，否则该章节不能算完成。

每一章都要回答三个问题：

- 工作里会遇到什么真实场景？
- 用户要看懂哪些证据，才能判断问题在哪里？
- 通关后能留下什么求职/面试表达，而不是只拿到一个虚拟 XP？

最终验收不是“页面数量变多”，而是用户能形成一套可迁移能力：看到问题能拆流程，看到代码能找证据，收到 Agent 交付能验收，面试时能把项目讲成有背景、有行动、有结果、有反思的故事。

### 当前方向

先做 `AI 应用开发` 主线，因为它最贴近当前求职趋势，也最适合把“会用 Agent 做项目”转化成可展示能力。

后续岗位路线通过“路线加载”扩展：

- `AI 应用开发`：API 接入、流式响应、RAG、Agent 工具调用、验收与安全边界。
- `Java 后端`：接口、数据库、事务、缓存、部署与排障。
- `前端工程`：组件状态、交互、请求链路、性能和可访问性。

路线选择必须简单：用户只需要选岗位方向，不需要理解复杂课程体系。

## 当前已完成切片

### R327：Java 第 4 关上线港剧情与证物归属修复

- [x] 浏览器从 `#chapter-java-4` 进入 Java 第 4 关，发现剧情线索仍露出 AI 第 14 章旧语境：`第 14 章入口`、AI 路线入口、`AI_API_KEY`、AI 调用失败率、第一章 `response.ok`/数据库写入示范卡。
- [x] `java-release-harbor` 剧情不再通过浅层 map 复用 AI 第 14 章线索；五个地点改为 Java 服务上线港独立证据：`order-service`、`POST /api/orders`、`JWT_SECRET`、`PAYMENT_API_URL`、订单表迁移、`/actuator/health`、下单成功率、支付回调失败率和回滚后验证。
- [x] `sandbox/java-release-harbor` 证物改成订单服务上线语境：发布计划、生产配置、冒烟、监控、后端日志、Agent 交付说明和固定修复示例都不再使用 AI 第 14 章路径或 `AI_API_KEY`。
- [x] Java 上线港 Lab 的先读卡、证据表达示范卡和表达检查改为上线门禁语境，禁止第一章保存链路示范卡回流。
- [x] 加严 `src/App.test.tsx`：Java 第 4 关剧情和 Lab 渲染都禁止出现 `AI_API_KEY`、AI 失败率、`response.ok 后显示 saved`、数据库写入、保存刷新等旧词。

验收：`npm run test -- src/App.test.tsx --run -t "Java 第 4 关剧情|Java 事故 Lab|岗位 Lab 默认"` 通过 3 项目标测试；`npm run verify:quick` 通过 lint、typecheck、11 个测试文件 / 188 个测试。浏览器隔离 API `4403`、临时 SQLite `/tmp/code-quest-r327.sqlite`、Vite `5253` 下，`#chapter-java-4` 完整收集 10/10 剧情线索，进入伙伴会合和实战 Lab；剧情和 Lab 首屏保持 Java 上线港语境，控制台 error 为 0。沙盒自身 `npm test` 仍按练习设计失败 6 项，代表用户需要修 `server/releaseGate.js`，不是本轮应用门禁失败。

### R326：跨电脑拉取说明更新

- [x] 核对本机 `HEAD`、`origin/cx/ai-career-rpg-home` 和 GitHub 远端分支一致；当前功能基线为 `5651c18 fix(rpg): clean frontend testing story examples`，交接基线为 `0fb18e7 docs(rpg): clarify collaborator pull steps` 或更晚提交。
- [x] 更新 `HANDOFF.md`、`docs/cross-computer-handoff.md` 和 `docs/cx-ai-career-rpg-home-merge-notes.md`，把另一台电脑怎么拉、拉完怎么确认、已有本地改动怎么保护写成可照抄步骤。
- [x] 明确当前是可跨电脑继续开发的阶段分支，不需要先合并 `main`；不建议直接合并，仍需全站视觉终审、PR 审查和真人试玩。

验收：另一台电脑按交接命令拉取后，`git log --oneline -1` 应显示 `0fb18e7 docs(rpg): clarify collaborator pull steps`、`5651c18 fix(rpg): clean frontend testing story examples` 或更晚提交；`git rev-parse HEAD`、`git rev-parse origin/cx/ai-career-rpg-home` 和 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 的 hash 应一致；`node -v` 应为 `.nvmrc` 指定的 `v24.13.1`。

### R299：跨电脑交接与合并边界复核

- [x] 核对本地分支 `cx/ai-career-rpg-home` 与远端 `origin/cx/ai-career-rpg-home` 对齐；最新已推送提交为 `2dd44d3927a9d2de4b5e96f3737553e35d1a3f68 feat(rpg): guide case four lab scenes`。
- [x] 明确远端默认 HEAD 仍指向旧 `feat/guided-learning-bridge`，另一台电脑必须显式切换到 `cx/ai-career-rpg-home`，否则会拉到旧工作线。
- [x] 刷新 `HANDOFF.md` 与 `docs/cx-ai-career-rpg-home-merge-notes.md`：补充拉取命令、当前完成度、不能直接合并的原因、下一步开发顺序和验收边界。
- [x] 当前可以跨电脑继续开发；不建议直接合并到 `main`。合并前仍需 PR 审查、完整 `npm run verify`、桌面与 390px 浏览器抽检。

验收：新电脑按文档命令能拉到 `cx/ai-career-rpg-home`，看到 `2dd44d3` 或更新提交；接手者能先读交接再继续第 5 章实战体验细修或第 1 章后半段打磨，而不是误从旧默认分支开发。

### R306：跨电脑拉取完整性与交接二次校准（历史记录，最新以 R315 为准）

- [x] 当时核对本地 `cx/ai-career-rpg-home` 与 `origin/cx/ai-career-rpg-home` 对齐，远端 hash 为 `1b3cf5dd30bbed6aa2e79d2356c869d6feae6e12`；该记录已被 R315 的 `4370ddf` 核对替代。
- [x] 确认远端默认 HEAD 仍指向 `feat/guided-learning-bridge`，另一台电脑不能只依赖 clone 默认分支，必须显式切到 `cx/ai-career-rpg-home`。
- [x] 刷新 `HANDOFF.md` 和 `docs/cx-ai-career-rpg-home-merge-notes.md`，把旧的 `9171ac8` / `1a40fe4` 核对口径改成当前真实 HEAD，并补充 `git rev-parse HEAD` 与 `git rev-parse origin/cx/ai-career-rpg-home` 一致性检查。
- [x] 明确当前可以跨电脑完整拉取继续开发，但仍不建议直接合并到 `main`；合并前还需要实战 Lab 深链抽检、全站视觉终审、PR 审查和真人试玩。

验收：这是历史口径。当前另一台电脑按交接命令拉取后，`git log --oneline -1` 应为 R315 记录的 `4370ddf feat(rpg): fold lab support dossier` 或更新提交，且本地 HEAD 与远端分支 hash 一致。若看到 `1b3cf5d`，说明还停在旧阶段，需要继续 `git fetch` / `git pull --ff-only`。

### R307：Java 第 2 关实战会合与 Lab 语境修复

- [x] 修复章节教学完成后的伙伴会合页路线身份：会合页现在按章节 id 显示 `Java 后端 / 前端工程 / AI 应用开发`，不再把 Java/前端岗位路线误标成 AI 主线。
- [x] 修复 Java 第 2 关事务 Lab 继承旧 AI 数据一致性文案的问题：实战正文、步骤、材料导览和代码位置改为订单、库存、下单、`PlaceOrderButton.jsx`、`orderRepository.js` 语境，不再出现 `SaveDraftButton.jsx` 或 `draftRepository.js`。
- [x] 新增岗位路线契约测试，锁定 Java/前端路线身份解析，并防止 Java 事务 Lab 可见配置重新出现旧草稿保存语境。
- [x] 浏览器验收：隔离 API `4374`、临时 SQLite `/tmp/code-quest-r307.sqlite`、Vite `5224`；`#chapter-java-2` 完成教学 → 伙伴会合 → 进入实战 Lab。会合页显示 `Java 后端 / 岗位路线 · 第 2 章`；Lab 显示 `Java 后端 · 第 2 关`、订单/库存/事务证据；桌面 1200 和 390px 均无横向溢出，控制台无 error。

验收边界：本轮完成 Java 第 2 关深链到 Lab 的代表性修复；Java/前端第 3-5 关仍需逐关做同样的会合页、实战语境、材料导览和移动端抽检。

### R308：Java 第 3 关与前端第 4 关 Lab 语境收口

- [x] Java 第 3 关缓存观测 Lab 不再只沿用 AI 第 6 章“页面慢/性能优化”话术；可见流程改为旧数据、缓存命中、数据库版本、TTL、异步刷新和复测收敛。
- [x] 前端第 4 关无障碍 Lab 不再沿用 AI 第 14 章“上线门禁/生产变量/备份恢复”话术；可见流程改为语义按钮、键盘路径、读屏提示、焦点顺序、对比度、390px 和回归证据。
- [x] 新增回归测试，覆盖 Java 缓存和前端无障碍完整 Lab 配置，包括 baseline、practical、steps、artifactGuides 和 result，防止旧主线语境从结算页或材料导览漏回。
- [x] 浏览器验收：隔离 API `4375`、临时 SQLite `/tmp/code-quest-r308.sqlite`、Vite `5225`；`#chapter-frontend-4` 完成教学 → 伙伴会合 → 进入实战 Lab。会合页显示前端工程岗位路线；Lab 显示前端第 4 关、键盘/读屏/390px 语境，桌面 1200 与 390px 无横向溢出，控制台无 error。

验收边界：本轮修的是 Lab 可见学习语境；`frontend-accessibility-proof` 的教学 step id 和部分沙盒文件名仍继承第 14 章结构，后续若要做到完全独立的无障碍关卡，需要继续重做证物文件与教学步骤所有权。

### R309：Java 第 5 关事故 Lab 语境收口

- [x] Java 第 5 关线上事故 Lab 不再只沿用第 14 章“上线前检查”话术；可见流程改为报警指标、requestId、异常栈、版本号、影响范围、止血/回滚和恢复复测。
- [x] 新增回归测试，覆盖 Java 事故 Lab 的 baseline、practical、steps、artifactGuides 和 result，防止重新出现 `上线门禁`、`生产变量`、`备份恢复` 这些上线前模板词。
- [x] 浏览器验收：隔离 API `4376`、临时 SQLite `/tmp/code-quest-r309.sqlite`、Vite `5226`；`#chapter-java-5` 完成教学 → 伙伴会合 → 进入实战 Lab。会合页显示 Java 后端岗位路线；Lab 显示 Java 第 5 关、报警/requestId/回滚语境，桌面 1200 与 390px 无横向溢出，控制台无 error。

验收边界：本轮修的是 Java 第 5 关 Lab 可见学习语境；该关教学 step id 仍复用第 14 章结构，后续若要做到完全独立事故关卡，需要继续重做教学步骤所有权。

### R310：前端第 3 与第 5 关 Lab 语境收口

- [x] 前端第 3 关性能 Lab 不再只继承 AI 第 6 章基础配置；可见流程改为首屏瀑布图、JS 资源、接口 TTFB、Server-Timing、X-Cache、React 渲染画像和第二次访问复测。
- [x] 前端第 5 关测试 Lab 不再露出 AI 主线 `/api/canvases` 保存链路；可见流程改为旧故障红灯、报告校验器、Network 旁证、浏览器手动复测、sourceHash 当前性、回归风险和 Agent 交付审查。
- [x] 新增回归测试，覆盖前端性能/测试 Lab 的 baseline、flowItems、steps、artifactGuides 和 result，防止重新出现 `主线 1-6`、`主线 1-11`、`AI 应用开发`、`/api/canvases` 或 `验收试炼画布` 这类串台词。

验收边界：本轮先完成前端第 3 与第 5 关 Lab 可见学习语境；浏览器深链验收仍需完成并补录，沙盒证物本身仍可继续做更深的岗位专属化。

### R311：Java 第 4 关上线港 Lab 语境收口

- [x] Java 第 4 关上线 Lab 不再只保留第 14 章基础结果文案；可见流程改为发布窗口、影响范围、发布负责人、生产配置、密钥边界、备份恢复、390px 冒烟、监控信号和回滚后验证。
- [x] 新增回归测试，覆盖 Java 上线港 Lab 的 baseline、flowItems、steps、artifactGuides 和 result，防止重新出现 `主线 1-14` 或 `AI 应用开发` 这类串台词。
- [x] 核心教学口径固定为：构建通过不等于可以上线；上线能力要证明配置、数据、冒烟、监控和退路都可复核。

验收边界：本轮完成 Java 第 4 关 Lab 可见学习语境；浏览器深链验收和更深的沙盒所有权重做仍可继续补。

### R312：岗位教学桥地图不再回退第一章

- [x] 给 Java 后端第 2-5 关、前端工程第 2-5 关补齐独立 `chapterCinematics` 地图镜头契约，教学桥项目地图不再因为缺少配置回退到第一章 `数据接力路线 / 断流档案河 / 失忆数据库`。
- [x] 新增回归测试：AI 15 章仍保持 15 种独立地图拓扑；岗位 10 章都必须拥有自己的 `chapterId`、地图标题、地形和地标，且不得出现第一章失忆数据库文案。
- [x] 浏览器入口抽检：隔离 API `4379`、临时 SQLite `/tmp/code-quest-r312.sqlite`、Vite `5229`；`#chapter-java-4` 和 `#chapter-frontend-5` 点击开始闯关后均保持岗位路线故事语境，桌面 1200 无横向溢出，控制台 0 error，未出现第一章地图词。

验收边界：本轮修的是教学桥地图镜头契约的 fallback 问题；完整逐章进入教学桥地图页和实战 Lab 的深链验收仍需继续补。

### R313：实战页任务导演台

- [x] 把实战页原本连续分散的「实战剧情向导」「本步任务卷轴」「流程接力小剧场」收进同一个 `任务导演台`，桌面上并排展示角色地点、为什么学、先看什么、最后交什么和上一棒/当前棒/下一棒，减少用户在多张卡之间来回滚动拼流程。
- [x] 手机端 `任务导演台` 自动单列，保留“角色地点 → 本步任务 → 接力对白”的阅读顺序，不引入横向溢出。
- [x] 新增主流程回归断言：第一章进入实战后必须在 `任务导演台` 中同时看到角色、任务目的和前后端接力词，防止再次退回散乱导读。
- [x] 验证：`npm run test -- src/App.test.tsx --run` 54 个测试通过；完整 `npm run verify` 通过，10 个测试文件 / 180 个测试、生产构建和 TeachingBridge 懒加载检查均通过。浏览器隔离 API `4380`、临时 SQLite `/tmp/code-quest-r313.sqlite`、Vite `5230` 下，手机 390×844 剧情路径 `scrollWidth = clientWidth = 390`、暗色背景 `rgb(7, 12, 20)`、控制台 0 error。

验收边界：本轮完成实战页导读信息的视觉收束；仍需继续做完整实战 Lab 桌面/手机截图验收，并继续压缩后续流程图、路线牌、接力板等辅助资料的折叠节奏。

### R314：实战辅助卷宗默认折叠

- [x] 把实战页的完整流程图、案件路线牌和实战接力板收进 `辅助卷宗`，默认只展示本步摘要、完整流程标题和当前这一棒，用户需要时再展开全图。
- [x] 展开后仍保留 `完整流程图 / 本关案件路线牌 / 实战接力板`，不删除学习材料，只调整信息层级，避免新手在作答前被多张辅助卡淹没。
- [x] 主流程回归测试更新：默认看不到案件路线牌和实战接力板，点击「展开流程地图」后完整辅助资料出现；第 1、3、4、5 章仍能默认读到 `当前这一棒` 摘要。
- [x] 验证：完整 `npm run verify` 通过，10 个测试文件 / 180 个测试、生产构建和 TeachingBridge 懒加载检查均通过。浏览器隔离 API `4381`、临时 SQLite `/tmp/code-quest-r314.sqlite`、Vite `5231` 下，第一章剧情页点击开始闯关后 390×844 无横向溢出，暗色背景 `rgb(7, 12, 20)`，地点航线、名词小抄和完整流程卷轴仍可见，控制台 0 error。

验收边界：本轮优化实战页信息层级和移动端负担；完整实战 Lab 桌面/手机逐步截图验收仍需继续补。

### R315：跨电脑拉取口径校准

- [x] 核对本机 `HEAD`、`origin/cx/ai-career-rpg-home` 和 GitHub 远端分支一致；业务功能基线为 `4370ddfc02a17cf1a756b398053f50a9525defc2`，交接文档提交后的最新远端 HEAD 以 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 为准。
- [x] 刷新 `HANDOFF.md`、`docs/cx-ai-career-rpg-home-merge-notes.md` 和 `docs/cross-computer-handoff.md`，把旧的 `1b3cf5d`、`1a40fe4`、`9171ac8` 核对口径升级为当前真实 HEAD。
- [x] 明确另一台电脑必须显式拉取并切换 `cx/ai-career-rpg-home`，不要依赖远端默认 HEAD；拉完后用 `git rev-parse HEAD`、`git rev-parse origin/cx/ai-career-rpg-home` 和 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 三方比对。

验收：另一台电脑按交接命令拉取后，`git log --oneline -1` 应为本次交接文档提交、`4370ddf feat(rpg): fold lab support dossier` 或更新提交，且本地 HEAD 与远端分支 hash 一致。当前分支可以完整拉取继续开发，但仍不建议直接合并到 `main`；合并前还要做 PR 审查、完整 `npm run verify` 和桌面/390px 视觉终审。

### R316：岗位实战 Lab 辅助卷宗渲染护栏

- [x] 新增渲染级回归测试，覆盖 `java-release-harbor`、`frontend-performance-proof` 和 `frontend-testing-proof` 三个岗位代表 Lab。
- [x] 锁定岗位 Lab 默认信息层级：首屏必须有 `任务导演台`、`辅助卷宗` 和 `当前这一棒`，但 `本关案件路线牌` 与 `实战接力板` 默认不渲染，避免用户一进实战就被全量辅助资料淹没。
- [x] 锁定展开后的完整资料：点击「展开流程地图」后，必须出现岗位自己的完整流程、案件路线牌和实战接力板，且内容来自对应 `LabConfig`。
- [x] 锁定岗位语境不串台：Java 上线港、前端性能塔、前端回归试炼场不能出现 AI 主线旧词、`/api/canvases` 或 `验收试炼画布`。
- [x] `App.test.tsx` 因真实路线浏览很重，在本文件内将 Vitest timeout 调整为 180 秒，避免全套并行测试时长路径随机超时。

验收：`npx vitest run src/App.test.tsx --reporter dot` 通过 55 项测试；`npm run verify:quick` 通过 lint、typecheck、10 个测试文件 / 181 个测试。

### R317：前端测试 Lab 当前流程棒错位修复

- [x] 浏览器验收使用隔离 API `4390`、临时 SQLite `/tmp/code-quest-r317.sqlite`、Vite `5240`，从 `#chapter-frontend-5` 进入前端第 5 关，逐幕收集 8/8 线索并进入伙伴会合与实战 Lab。
- [x] 确认教学剧情页持续显示岗位路线身份，四个地点和角色按前端测试路线切换：测试仲裁官、交互取证师、路径审查官、交付守门人；Playwright 控制台 error 为 0。
- [x] 发现并修复实战 Lab 流程错位：第一题 `复现旧故障` 不应显示当前棒为 `单测`，否则新手会误以为刚开始就跳到报告校验器。
- [x] 给 `frontend-testing-proof` 的复用步骤补专属 `flowItemIndex`：复现旧故障 → 旧故障；守单元边界 → 单测；串集成流程 → 集成；沙盒手动报告 → 浏览器；过期报告、Agent、审查和面试 → 接收。
- [x] 扩展岗位 Lab 渲染测试，锁定前端测试 Lab 第一题默认 `当前这一棒` 必须是 `旧故障`。

验收：`npx vitest run src/App.test.tsx -t "岗位 Lab 默认收束辅助资料"` 通过；完整 `npm run verify` 通过格式、lint、typecheck、10 个测试文件 / 181 个测试、生产构建和 TeachingBridge 懒加载检查。Vite 主包体积 warning 仍是已知债务，不是失败。

### R318：实战导演台本幕流程翻译

- [x] 在 `任务导演台` 中新增 `本幕流程翻译`，把上一棒、当前要盯住的证据和下一棒合成一段人话，解决用户进入实战后“不知道谁把什么交给谁”的迷路感。
- [x] 翻译卡固定给出三步阅读顺序：先看当前地点和关键材料；再说它能证明什么、不能证明什么；最后决定下一棒还需要哪份证据。
- [x] 该卡跟随所有 Lab 的 `LabConfig.flowItems` 和当前步骤动态变化，不另造一套路线文案，避免再次出现导演台、辅助卷宗和真实步骤互相打架。
- [x] 手机端卡片自动变成单列，继续保持暗色 RPG 风格，不增加白底课件断层。
- [x] 回归测试锁定岗位 Lab 和第一章实战默认都能看到 `本幕流程翻译`，并且含有当前流程棒、下一棒和“能证明什么、不能证明什么”。

验收：`npm run test -- src/App.test.tsx --run -t "岗位 Lab 默认收束辅助资料|首页到第一章"` 通过目标测试；完整 `npm run verify` 通过格式、lint、typecheck、10 个测试文件 / 181 个测试、生产构建和 TeachingBridge 懒加载检查。浏览器隔离 API `4391`、临时 SQLite `/tmp/code-quest-r318.sqlite`、Vite `5241` 下，从 `#chapter-frontend-5` 逐幕收集 8/8 线索进入实战 Lab，首屏显示 `本幕流程翻译`、`能证明什么、不能证明什么` 和下一棒 `守报告校验器`；390×844 下 `scrollWidth = clientWidth = 390`，背景暗色 `rgb(7, 12, 20)`，控制台 error 为 0。

### R321：前端第 5 关剧情层保存链路串台修复

- [x] 浏览器复核 `#chapter-frontend-5` 时发现剧情线索层仍从通用 AI 验收章露出 `/api/canvases` 和旧保存代码片段，虽然 Lab 配置已修；这是用户截图里“风格和学习逻辑断层”的同类问题。
- [x] 给 `frontend-testing-proof` 新增专属剧情/journey 文案重写：把通用保存链路改成筛选交互、可见列表、DOM、Network 和报告指纹；第一幕代码片段改为 `applyFilter` / `readVisibleRows`，不再讲 AI 主线保存画布。
- [x] 新增运行时回归测试，直接读取 `getTeachingStoryScenes("frontend-testing-proof")`，防止 `/api/canvases`、保存链路、保存画布或验收试炼画布从 `TeachingBridge` 剧情层回流。
- [x] 同步更新交接文档，明确另一台电脑必须拉 `cx/ai-career-rpg-home`，不要停在默认分支；拉完用 `git log --oneline -1`、`git rev-parse HEAD` 和 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 核对。

验收：`npm run test -- src/App.test.tsx --run -t "前端第 5 关剧情|岗位 Lab|前端回归|上线港"` 通过 3 项目标测试；`npm run test -- src/teachingRemediation.test.ts --run -t "前端第 5 关教学剧情"` 通过；`npm run typecheck` 通过。浏览器隔离 API `4394`、临时 SQLite `/tmp/code-quest-r321.sqlite`、Vite `5244` 下，`#chapter-frontend-5` 桌面 1200 和 390px 均无横向溢出，暗色背景 `rgb(7, 12, 20)`，控制台 error 为 0；页面正文不再出现 `/api/canvases`、`canvas-save-persistence`、保存画布、验收试炼画布或旧保存链路。

### R322：前端第 4 关教学层无障碍所有权修复

- [x] 接着 R308 的 Lab 修复，继续把 `frontend-accessibility-proof` 的教学 scenario 从第 14 章上线门禁结构里拆出来；项目地图节点改为用户任务、语义与状态反馈、移动端复测、可访问性哨塔、回归守门和无障碍交付决定。
- [x] 代码导读从 `release-checklist.md` / 生产环境 / AI_API_KEY / 备份恢复 / 回滚，改为 `docs/accessibility-checklist.md` 和 `frontend/accessibility-audit.md`，强调 button/label/landmark、Tab/focus、aria-live、390px 与旧路径回归。
- [x] 新增教学层回归测试，直接读取 `frontendAccessibilityProofScenario`，防止 `case-014-release-readiness`、上线门禁、上线计划、生产变量、生产环境、AI_API_KEY、备份恢复和数据备份回流。
- [x] 浏览器深链抽检 `#chapter-frontend-4`：入口和闯关后的剧情页均保持前端工程/无障碍语境，用户能看到可访问性、键盘、读屏、焦点、语义和 390px 回归路线。

验收：`npm run test -- src/teachingRemediation.test.ts --run -t "前端第 4 关教学剧情|前端第 5 关教学剧情"` 通过；`npm run test -- src/App.test.tsx --run -t "前端无障碍|Java 事务和前端性能|岗位路线"` 通过 11 项目标测试；完整 `npm run verify` 通过 10 个测试文件 / 185 个测试、生产构建和 TeachingBridge 懒加载检查。浏览器隔离 API `4395`、临时 SQLite `/tmp/code-quest-r322.sqlite`、Vite `5245` 下，`#chapter-frontend-4` 桌面 1280 与 390px 均无横向溢出，暗色背景 `rgb(7, 12, 20)`，控制台 error 为 0；页面正文不再出现上线门禁、上线计划、生产变量、生产环境、备份恢复或 AI_API_KEY。

### R323：Java 第 5 关教学层事故时间线所有权修复

- [x] 接着 R309 的 Lab 修复，继续把 `java-production-incident` 的 teaching scenario 从第 14 章上线门禁结构里拆出来；项目地图节点改为事故窗口、日志与运行环境、影响范围、报警哨塔、止血决策门和事故结论。
- [x] 代码导读从 `release-checklist.md` / 生产配置 / AI_API_KEY / 备份恢复 / 上线决定，改为 `docs/incident-response-timeline.md` 和 `server/IncidentTimeline.java`，强调 errorRate、P95、successRate、requestId、异常栈、影响范围、止血和恢复复测。
- [x] 新增教学层回归测试，直接读取 `javaProductionIncidentScenario`，防止 `case-014-release-readiness`、上线门禁、上线计划、生产变量、生产环境、AI_API_KEY、备份恢复和数据备份回流。
- [x] 浏览器深链抽检 `#chapter-java-5`：入口和闯关后的剧情页均保持 Java 后端/线上事故语境，用户能看到报警、requestId、异常栈、影响范围、止血、回滚和恢复复测路线。

验收：`npm run test -- src/teachingRemediation.test.ts --run -t "Java 第 5 关教学剧情|前端第 4 关教学剧情|前端第 5 关教学剧情"` 通过；`npm run test -- src/App.test.tsx --run -t "Java 事故 Lab|岗位路线"` 通过 11 项目标测试；完整 `npm run verify` 通过 10 个测试文件 / 186 个测试、生产构建和 TeachingBridge 懒加载检查。浏览器隔离 API `4396`、临时 SQLite `/tmp/code-quest-r323.sqlite`、Vite `5246` 下，`#chapter-java-5` 桌面 1280 与 390px 均无横向溢出，暗色背景 `rgb(7, 12, 20)`，控制台 error 为 0；页面正文不再出现上线门禁、上线计划、生产变量、生产环境、备份恢复或 AI_API_KEY。

### R300：第 3 章登录态实战剧情导演层

- [x] 第 3 章实战步骤补齐场景、角色、任务卷轴和流程接力：身份路线、凭证存储、401 反证、刷新复查、Agent 委托、交付审查和面试复盘都明确“谁把凭证交给谁，刷新后谁来认人”。
- [x] 登录态材料继续使用真实沙盒证据：登录响应、浏览器存储、`/api/me` 401、服务端日志、Agent 交付说明和测试报告。
- [x] 新增回归测试，确保第 3 章实战随步骤切换身份回廊守卫、凭证门牌书记官、接口接待员、任务锻造师、交付审判官和面试策士，不再退回普通表单体验。

验收：`npm run test -- src/App.test.tsx --run` 通过 48 个测试；浏览器验收需继续确认桌面与 390px 手机无横向溢出、控制台无错误。

### R301：第 4 章接口报错实战剧情导演层

- [x] 第 4 章实战步骤补齐场景、角色、任务卷轴和流程接力：请求体证词、状态码判词、错误体修复、日志串证、Agent 委托、交付审查和面试复盘都明确“payload 缺什么、为什么是 400、requestId 怎么串起来”。
- [x] 接口错误学习继续使用真实沙盒证据：无效请求体、500 反证、期望 400 结构、后端日志、Agent 交付说明和错误路径测试报告。
- [x] 新增回归测试，确保第 4 章实战随步骤切换接口接待员、状态码审判官、日志档案官、任务锻造师、交付审判官和面试策士，不再退回普通表单体验。

验收：`npm run test -- src/App.test.tsx --run` 通过 49 个测试；`npm run verify:quick` 通过 lint、typecheck、10 个测试文件 / 174 个测试；浏览器隔离 API `4367`、临时 SQLite `/tmp/code-quest-r301.sqlite`、Vite `5217` 下确认桌面与 390px 手机无横向溢出、控制台 error 为 0。

### R302：第 5 章数据一致性实战剧情导演层

- [x] 第 5 章实战步骤补齐场景、角色、任务卷轴和流程接力：熔炉入口、Network 双轨、幂等锤印、唯一约束城门、事务炉心、Agent 委托、交付审查和面试复盘都明确“同一动作为什么不能写出两条记录”。
- [x] 数据一致性学习继续使用真实沙盒证据：重复提交 Network、Idempotency-Key、clientMutationId、数据库前后记录、后端日志、Agent 交付说明和事务回滚测试报告。
- [x] 新增回归测试，确保第 5 章实战随步骤切换索引执衡官、回声取证官、数据库守门员、任务锻造师、交付审判官和面试策士，并用 `flowItemIndex` 避免后半段流程高亮错位。

验收：`npm run test -- src/App.test.tsx --run` 通过 50 个测试；`npm run verify:quick` 通过 lint、typecheck、10 个测试文件 / 175 个测试；浏览器隔离 API `4368`、临时 SQLite `/tmp/code-quest-r302.sqlite`、Vite `5218` 下确认桌面 1280 与 390px 手机无横向溢出、控制台 error 为 0。

### R303：第 1 章实战后半段证据交接细修

- [x] 第 1 章沙盒验收、Agent 委托、交付审查、因果解释和面试迁移补齐任务卷轴：每一步都解释为什么学、先看什么证据、最后交出什么判断。
- [x] 第 1 章后半段补齐流程棒映射：沙盒验收和 Agent 委托停在数据层，交付审查、因果解释和迁移停在数据库反证，避免用户以为又回到前端成功提示。
- [x] 新增回归测试，确保第 1 章后半段显示“页面绿灯不等于数据库成功”“Agent 不能靠猜”“审查看链路闭合”“因果解释拆页面/接口/数据库”“迁移到头像上传”等新手提示。

验收：`npm run test -- src/App.test.tsx --run` 通过 51 个测试；`npm run verify:quick` 通过 lint、typecheck、10 个测试文件 / 176 个测试；浏览器隔离 API `4369`、临时 SQLite `/tmp/code-quest-r303.sqlite`、Vite `5219` 下从第 1 章剧情探索完整走到实战 Lab，桌面 1280 与 390px 手机无横向溢出，控制台 error 为 0。

### R174：第五章 RAG 索引并发延迟迁移复测

- 新增 `rag-index-concurrency-retest` 独立沙盒：单次知识文档上传后，两个 Worker 因非原子领取同时处理 job 417，并写出重复 chunks。
- 第五章实战提交至少 24 小时后才可开始复测；用户需要沿单次 Network、双 Worker 时间线、数据库快照和仓库代码区分原子领取、唯一约束与事务边界。
- 新增双星索引井、索引执衡官、奶油金机械兔、双轨汇流地图和环绕冲突点镜头；地图结构直接表达两个 Worker 争抢同一任务。
- 桌面与 390px 手机无横向溢出，证物切换正常；132 项自动化测试和生产构建通过。
- 当前延迟迁移复测覆盖第 1–9 章；第 10–15 章与真人学习效果仍待验证。

### R176：第七章模型密钥轮换延迟迁移复测

- [x] 新增 `model-key-rotation-retest` 独立沙盒，覆盖浏览器请求、服务端环境变量、模型供应商 401、流式边界和错误兜底。
- [x] 接入第 7 章延迟解锁配置、模型密钥熔炉地点、导师、密钥边界地图和按钥匙匣推进的镜头。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是网关把旧 Key 写死，训练用户识别“能调用”与“安全可轮换”的区别。
- [x] 服务端白名单与必填步骤门禁已接入，供应商错误不能把内部配置原样回传浏览器。
- [x] Node 24 下 `npm run verify` 通过：9 个测试文件、136 项测试、生产构建和动态 chunk 门禁；桌面/390px 浏览器入口无横向溢出、控制台 0 error，截图已保存在本地 `output/playwright/r176-chapter7-*.png`。

验收：用户能解释“浏览器交什么、自有 API 收什么、供应商拒绝什么、错误如何安全回到界面”，并能写出不把 Key 交给 Agent 或前端的修复委托。

### R177：第八章引用可验证回答延迟迁移复测

- [x] 新增 `citation-grounding-retest` 独立沙盒，覆盖模型回答、允许引用资料、Prompt 合约、引用命中校验和日志。
- [x] 接入第 8 章延迟解锁配置、幻觉镜厅地点、镜厅校对师、引用镜面地图和镜面横扫镜头。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是引用未命中时仍补全事实，训练用户建立“资料不足就拒答/转人工”的边界。
- [x] 服务端白名单与必填步骤门禁已接入，回答材料和路径继续经过固定沙盒读取。
- [x] Node 24 下 `npm run verify` 通过：9 个测试文件、138 项测试；桌面/390px 浏览器无横向溢出、控制台 0 error。

验收：用户能解释“资料如何进入回答、引用如何证明结论、没有命中时系统应该怎么办”，并能把这条规则写进 Agent 委托和验收标准。

### R178：第九章 RAG 检索版本错配延迟迁移复测

- [x] 新增 `retrieval-mismatch-retest` 独立沙盒，覆盖上传、Chunk 来源、TopK 命中、检索器代码、引用回答和日志。
- [x] 接入第 9 章延迟解锁配置、知识迷宫深井地点、检索狐、检索迷宫地图和迷宫环绕镜头。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是只按相似度返回旧版本，训练用户区分“命中”与“当前有效”。
- [x] 服务端白名单与必填步骤门禁已接入，材料继续经过固定沙盒读取和路径脱敏。
- [x] Node 24 下 `npm run verify` 通过：9 个测试文件、140 项测试；桌面/390px 浏览器无横向溢出、控制台 0 error。

验收：用户能解释文档如何切分、来源和版本为什么要保留、TopK 为什么不等于正确答案，并能设计新旧版本与无关问题的复测。

### R179：第十章 Agent 工具边界延迟迁移复测

- [x] 新增 `tool-boundary-retest` 独立沙盒，覆盖 Agent 请求、工具注册表、参数 Schema、权限审计、失败回退和 Agent 交付说明。
- [x] 接入第 10 章延迟解锁配置、工具契约高塔、塔楼副官、可爱机械守门伙伴、权限门高塔地图和上升镜头。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是缺少通用资源归属校验，训练用户区分路径拦截、Schema 校验和真正的权限门。
- [x] 服务端白名单、必填步骤门禁和路径脱敏已接入；Node 24 下 `npm run verify` 通过：9 个测试文件、141 项测试；桌面/390px 浏览器无横向溢出、控制台 0 error。
- [x] 当前数据库中第十章原始实战尚未提交，复测 API 正确保持 `prerequisite`，未创建演示用 attempt。

验收：用户能解释“Agent 想做什么、工具允许做什么、参数是否合规、资源是否属于当前主体、拒绝如何可追踪”，并能把合法、越权和无权资源三类测试写进 Agent 委托。

### R180：第十一章可信验收证据延迟迁移复测

- [x] 新增 `verification-proof-retest` 独立沙盒，覆盖失败复现、过期全绿报告、验收校验器、Network、手动复测、源码指纹日志和 Agent 交付说明。
- [x] 接入第 11 章延迟解锁配置、验收试炼场、验收试炼官、证据竞技场地图和竞技场下落镜头。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是校验器没有核对源码指纹，训练用户区分“测试全绿”和“交付可信”。
- [x] Node 24 下 `npm run verify` 通过：9 个测试文件、143 项测试；桌面/390px 浏览器无横向溢出、控制台 0 error；临时验收数据已清理。

验收：用户能解释每类测试和 Network 各自证明什么，能识别过期报告，并能把源码版本、回归风险和手动路径写进 Agent 交付验收标准。

### R181：第十二章 Agent 委托契约延迟迁移复测

- [x] 新增 `brief-contract-retest` 独立沙盒，覆盖业务请求、模糊委托、越界范围、清晰委托、契约校验器、回滚和 Agent 交付说明。
- [x] 接入第 12 章延迟解锁配置、委托书锻造工坊、委托书锻造师、契约展开镜头和 Agent 委托契约地图。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是校验器没有强制回滚方案，训练用户区分可执行目标与可安全验收的委托。
- [x] Node 24 下 `npm run verify` 通过：9 个测试文件、145 项测试；第十二章桌面/390px 浏览器无横向溢出、控制台 0 error；临时验收数据已清理。

验收：用户能把真实业务请求写成背景、目标、边界、验收和回滚完整的 Agent 任务，并能指出哪些修改明确禁止。

### R182：第十三章交付证据审查延迟迁移复测

- [x] 新增 `review-evidence-retest` 独立沙盒，覆盖交付说明、Diff 范围、过期测试、桌面/390px 浏览器、文档同步、审查日志和拒收决定。
- [x] 接入第 13 章延迟解锁配置、交付审查庭、交付审查官、菱形扫镜头和审查庭地图。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是审查器没有检查测试报告源码版本，训练用户把小 Diff、绿色 CI 和可合并决定分开。
- [x] 第十三章桌面/390px 浏览器无横向溢出、控制台 0 error；临时验收数据已清理。

验收：用户能对照交付说明、Diff、测试版本、移动端边界和文档同步做出接收/退回决定，并写出需要补的证据。

### R183：第十四章上线门禁延迟迁移复测

- [x] 新增 `release-proof-retest` 独立沙盒，覆盖上线计划、生产环境变量、备份恢复、390px 冒烟、监控信号、回滚方案和上线日志。
- [x] 接入第 14 章延迟解锁配置、上线门禁塔、上线守门人、门锁镜头和上线安全地图。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是校验器忽略备份恢复验证，训练用户区分配置存在、恢复可用和上线后可观测。
- [x] 第十四章桌面/390px 浏览器无横向溢出、控制台 0 error；临时验收数据已清理。

验收：用户能写出上线前负责人、环境变量、备份恢复、移动端冒烟、监控和回滚的证据闭环，并知道什么情况下应该暂缓上线。

### R184：第十五章面试证据延迟迁移复测

- [x] 新增 `interview-proof-retest` 独立沙盒，覆盖新项目素材、STAR、故障复盘、技术取舍、追问演练和答辩 Rubric。
- [x] 接入第 15 章延迟解锁配置、终章答辩厅、终章答辩官、答辩环绕镜头和面试证据星图。
- [x] 初始报告稳定为 2 passed / 1 failed；失败点是校验器没有拦截夸大掌握程度，训练用户把证据、代价和未验证边界说清楚。
- [x] 第十五章桌面/390px 浏览器无横向溢出、控制台 0 error；临时验收数据已清理。

验收：用户能把一份新事故讲成有证据的 STAR，说明技术取舍和代价，回答追问，并诚实说明尚未验证的学习边界。

### R173：第四章模型限流延迟迁移复测

- 新增 `model-rate-limit-retest` 独立沙盒：合法 AI 客服摘要批次通过输入校验，上游模型返回 `429`，网关错误地抹成无 `requestId` 和重试信息的通用 `500`。
- 第四章实战提交至少 24 小时后才可开始复测；用户需要给浏览器、自有 API、模型供应商和错误映射器分别定责，再完成证据计划、Agent 委托与迁移复盘。
- 新增信号风暴调度塔、风暴调度官、暖金机械猫头鹰、告警下潜镜头和故障分流地图；人物与背景使用同一关键美术，地图明确标出上游 429 与错误 500 的不同边界。
- 手机端故障树与本步全部证物无需横向拖动；自动化覆盖四套复测配置唯一性、服务端门禁、API 证物读取和路径脱敏。
- 当前延迟迁移复测覆盖第 1–4 章；第 5–15 章与真人学习效果仍待验证。

### R172：第三章客服夜班延迟迁移复测

- 新增 `support-shift-session-retest` 独立沙盒：客服登录成功，但认证服务滚动重启后续期返回 401；失败测试证明内存 `Map` 会话无法跨实例保存。
- 第三章实战提交至少 24 小时后才可开始复测；用户需要完成独立诊断、证据计划、Agent 委托和人工测试复盘，提示使用继续如实影响候选等级。
- 新增夜航身份中转站、夜航身份官、检查点跟拍镜头和会话回环地图；手机端两列显示五节点，不需要左右拖动。
- 自动化覆盖配置唯一性、服务端门禁、API 证物读取和路径脱敏；全量验证为 9 个测试文件、128 项测试与生产构建通过。
- 当前延迟迁移复测覆盖第 1–3 章；第 4–15 章仍待开发，真人学习效果仍待验证。

### R171：十五章镜头与地图视觉分化

- 研究 Unity Cinemachine、Unreal Camera Cut Track 与 GDC 地标辨路原则，将可复用结论记录到 `docs/game-camera-and-map-rules.md`，不复制具体游戏美术或布局。
- 十五章各自声明镜头时长/曲线、地图地貌/地标/配色；十五种拓扑进一步改变底图纹理、节点轮廓和路径节奏。
- 地图步骤压缩重复导师说明，让桌面和 390px 首屏都直接露出可操作节点；产品工坊、性能瀑布、职业星图完成浏览器差异抽检。
- 自动化守住 15 章配置完整、地貌/地标/配色唯一、镜头格式和真实拓扑；真人是否更易辨路仍列为未验证项。

| ID   | 任务                          | 产物                                                                                                                                                       | 验证                                                    | 状态 |
| ---- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | ---- |
| R01  | AI 应用开发路线首页           | 首页默认展示主线 1-1、路线图、求职产出                                                                                                                     | 浏览器桌面/移动端烟测                                   | 通过 |
| R02  | 删除旧 V1 游戏化残留          | 删除 localStorage 小课、单选题成长逻辑                                                                                                                     | `npm run verify`                                        | 通过 |
| R03  | 移除用户可见基线诊断入口      | 入口自动创建路线任务记录                                                                                                                                   | 主流程测试                                              | 通过 |
| R04  | 统一成长身份语言              | `src/careerProfile.ts`                                                                                                                                     | 类型检查、旧数据迁移兼容                                | 通过 |
| R05  | 教学桥主线化                  | CASE 文案替换为主线 1-1/1-2                                                                                                                                | 浏览器扫描无旧词                                        | 通过 |
| R06  | 项目记忆更新                  | README、HANDOFF、changelog、本文档                                                                                                                         | diff 审计                                               | 通过 |
| R07  | 主线大厅 UI 优化              | 首页 HUD、任务板、路线进度、关卡首屏                                                                                                                       | 浏览器桌面/移动端烟测                                   | 通过 |
| R08  | 角色扮演世界观补强            | 见习 AI 调试师、代码城叙事、世界地图                                                                                                                       | 浏览器桌面/移动端烟测                                   | 通过 |
| R09  | 序章剧情与比喻引导            | 代码城失忆夜、向导台词、技术比喻卡                                                                                                                         | 浏览器桌面/移动端烟测                                   | 通过 |
| R10  | 视觉小说式剧情入口            | 生成 CG 背景、多屏序章、选择反馈、任务简报                                                                                                                 | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R11  | 游戏化 UI 去模板感            | 档案签 HUD、委托书对白框、竖向行动菜单                                                                                                                     | `npm run verify` + 浏览器截图烟测                       | 通过 |
| R12  | 多地点剧情探索学习            | 前端舞台、传送门、档案库、修复台四场景关卡                                                                                                                 | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R13  | CanvasStorm 真实项目预览      | 1-2 改为 Brief、方向、会话、AI 状态四章                                                                                                                    | `npm run verify` + 浏览器主路径烟测                     | 通过 |
| R14  | 数据流路线图补强              | 1-1 固定展示谁把什么交给谁和证据边界                                                                                                                       | `npm run verify` + 浏览器线索焦点烟测                   | 通过 |
| R15  | 实战 Lab 风格统一             | 代码阅读页改成暗色档案馆，补阅读导览                                                                                                                       | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R16  | 长期主线卷轴                  | 首页展示 AI 应用开发多章节后续路线                                                                                                                         | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R17  | 15 章路线 manifest            | `src/careerRoadmap.ts` 统一维护完整职业路线                                                                                                                | `npm run verify` + manifest 单测 + 浏览器烟测           | 通过 |
| R18  | 章节卷宗交互                  | 点击后续章节可查看九件套学习契约                                                                                                                           | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R19  | 第 3 章登录态剧情入口         | 身份回廊、Cookie/Token/Session 流程、入口测试                                                                                                              | `npm run test` + 浏览器桌面/390px 烟测                  | 通过 |
| R20  | 第 4 章接口报错剧情入口       | 接口审判庭、请求参数/状态码/日志流程、入口测试                                                                                                             | `npm run test`                                          | 通过 |
| R21  | 伙伴/宠物解锁骨架             | 每章 manifest 记录伙伴、宠物或装备解锁物                                                                                                                   | manifest 单测                                           | 通过 |
| R22  | 首页伙伴图鉴                  | 任务简报展示 15 章收集物、状态和角色图                                                                                                                     | 主流程测试                                              | 通过 |
| R23  | 第 5 章数据一致性剧情入口     | 一致性熔炉、幂等石灵、重复提交/唯一约束流程                                                                                                                | `npm run verify` + 浏览器烟测                           | 通过 |
| R24  | 第 6 章性能排查剧情入口       | 慢速迷雾、雾灯猫、瀑布图/TTFB/渲染/缓存流程                                                                                                                | `npm run verify` + 浏览器烟测                           | 通过 |
| R25  | 第 7 章 AI API 剧情入口       | 模型熔炉、密钥匣、密钥/流式/兜底流程                                                                                                                       | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R26  | 第 8 章幻觉控制剧情入口       | 幻觉镜厅、镜厅校对师、Prompt/context/引用/拒答                                                                                                             | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R27  | 第 9 章 RAG 知识库入口        | 知识迷宫、守卷人、检索狐、chunk/embedding/topK                                                                                                             | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R28  | 第 10 章 Agent 工具调用入口   | 工具契约大厅、塔楼副官、registry/schema/permission/fallback                                                                                                | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R29  | 第 11 章测试验收剧情入口      | 验收试炼场、验收试炼官、复现/单测/集成测试/手动报告                                                                                                        | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R30  | 第 12 章 Agent 委托书入口     | 委托书工坊、委托书锻造师、背景/目标/约束/验收/风险                                                                                                         | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R31  | 第 13 章交付审查剧情入口      | 交付审查庭、交付审查官、说明/Diff/测试/边界/拒收理由                                                                                                       | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R32  | 第 14 章上线前夜剧情入口      | 上线城门、上线守门人、计划/配置/备份/监控/回滚                                                                                                             | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R33  | 第 15 章终章答辩剧情入口      | 终章答辩厅、终章答辩官、STAR/故障复盘/技术取舍/追问                                                                                                        | `npm run verify` + 浏览器桌面/390px 烟测                | 通过 |
| R34  | 章节通关奖励闭环              | 已通关章节、伙伴解锁记录、暗色 RPG 结算页                                                                                                                  | profile 单测 + 主流程测试 + 浏览器烟测                  | 通过 |
| R35  | 伙伴背包/收藏册               | 可筛选收藏列表、解锁详情、能力印记、工作场景、面试复盘                                                                                                     | 主流程测试 + 浏览器桌面/390px 烟测                      | 通过 |
| R36  | 面试复盘册                    | 现象/定位证据/行动修改/验证动作/可迁移经验五段模板                                                                                                         | 主流程测试 + 浏览器桌面/390px 烟测                      | 通过 |
| R37  | 独立面试复盘房间              | 章节选择、五段复盘填写、本地 SQLite 学习记录保存                                                                                                           | API 契约测试 + 主流程测试                               | 通过 |
| R38  | 第 2 章主线直达               | 路线卷宗可直接进入 CanvasStorm 产品链路教学，底层教学数据从登录态改为 Brief/方向/候选/会话                                                                 | 主流程测试                                              | 通过 |
| R39  | 代码阅读页重做                | 教学桥统一暗色 RPG，代码导读增加阅读罗盘、逐行翻译、证据边界和 Agent 交接话术                                                                              | 主流程测试                                              | 通过 |
| R40  | 教学进度可信显示              | 教学桥进度只统计当前章节步骤，旧剧情记录不再把进度撑到 100% 以上                                                                                           | 主流程测试                                              | 通过 |
| R41  | 多岗位路线加载骨架            | `careerRoutes` 增加 AI/Java/前端路线元数据，首页用简单路线令牌展示可进入和即将解锁状态                                                                     | manifest 单测 + 主流程测试                              | 通过 |
| R42  | 第 2 章种子沙盒               | `sandbox/canvasstorm-product-brief` 提供 Brief、方向筛选、会话保存的故障代码、证据和测试                                                                   | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R43  | 第 3 章种子沙盒               | `sandbox/identity-session-corridor` 提供登录态、Cookie/Token、401 和刷新恢复的故障代码与证据                                                               | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R44  | 第 4 章种子沙盒               | `sandbox/api-error-court` 提供请求体、状态码、结构化错误和后端日志的故障代码与证据                                                                         | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R45  | 第 5 章种子沙盒               | `sandbox/data-consistency-forge` 提供重复提交、幂等键、唯一约束和事务边界的故障代码与证据                                                                  | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R46  | 第 6 章种子沙盒               | `sandbox/performance-fog-lab` 提供瀑布图、Server-Timing、渲染画像、缓存复测和性能测试证据                                                                  | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R47  | 第 7 章种子沙盒               | `sandbox/ai-api-key-vault` 提供前端密钥扫描、服务端环境变量、流式响应和失败兜底证据                                                                        | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R48  | 第 8 章种子沙盒               | `sandbox/hallucination-mirror-hall` 提供 Prompt 约束、上下文资料、引用校验和无资料拒答反例                                                                 | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R49  | 第 9 章种子沙盒               | `sandbox/rag-knowledge-maze` 提供 chunk 索引、topK 命中、来源引用和无关问题拒答反例                                                                        | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R50  | 第 10 章种子沙盒              | `sandbox/agent-tool-tower` 提供工具注册表、参数校验、权限拦截、失败回退和审计证据                                                                          | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R51  | 第 11 章种子沙盒              | `sandbox/verification-trial-arena` 提供失败复现、单测、集成测试、手动复测、过期报告和回归风险                                                              | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R52  | 第 12 章种子沙盒              | `sandbox/agent-brief-forge` 提供空泛委托、越界委托、清晰委托、验收命令、浏览器路径和交付格式                                                               | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R53  | 第 13 章种子沙盒              | `sandbox/delivery-review-court` 提供交付说明、Diff 范围、过期测试、移动端缺口、文档同步和拒收决定                                                          | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R54  | 第 14 章种子沙盒              | `sandbox/release-readiness-gate` 提供上线计划、环境变量、备份恢复、冒烟测试、监控和回滚方案                                                                | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R55  | 第 15 章种子沙盒              | `sandbox/interview-answer-forge` 提供素材库、STAR、故障复盘、技术取舍、追问演练和答辩 Rubric                                                               | API 契约测试 + 沙盒测试生成失败报告                     | 通过 |
| R56  | 第 2 章实战 Lab 场景化        | Lab 从第 1 章硬编码抽出配置；第 2 章接入 `canvasstorm-product-brief` 的步骤、提示、材料导览和沙盒目录                                                      | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R57  | 第 3 章实战 Lab 场景化        | 第 3 章接入 `identity-session-corridor` 的登录态路线、提示、材料导览、沙盒目录和面试复盘                                                                   | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R58  | 第 4 章实战 Lab 场景化        | 第 4 章接入 `api-error-court` 的请求体、状态码、错误结构、日志串证、材料导览和接口排障复盘                                                                 | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R59  | 第 5 章实战 Lab 场景化        | 第 5 章接入 `data-consistency-forge` 的重复提交、幂等键、唯一约束、事务边界、材料导览和一致性复盘                                                          | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R60  | 第 6 章实战 Lab 场景化        | 第 6 章接入 `performance-fog-lab` 的瀑布图、Server-Timing、渲染画像、缓存复测、材料导览和性能复盘                                                          | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R61  | 第 7 章实战 Lab 场景化        | 第 7 章接入 `ai-api-key-vault` 的密钥扫描、服务端环境变量、流式响应、失败兜底、材料导览和 AI API 复盘                                                      | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R62  | 第 8 章实战 Lab 场景化        | 第 8 章接入 `hallucination-mirror-hall` 的 Prompt 合约、上下文资料、引用校验、拒答边界和幻觉控制复盘                                                       | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R63  | 第 9 章实战 Lab 场景化        | 第 9 章接入 `rag-knowledge-maze` 的 chunk 来源、topK 命中、matches/citations、未命中拒答和 RAG 复盘                                                        | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R64  | 第 10 章实战 Lab 场景化       | 第 10 章接入 `agent-tool-tower` 的工具注册表、schema 校验、权限门禁、失败回退、审计日志和 Agent 工具复盘                                                   | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R65  | 第 11 章实战 Lab 场景化       | 第 11 章接入 `verification-trial-arena` 的失败复现、单测边界、集成流程、手动复测、过期报告和回归风险复盘                                                   | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R66  | 第 12 章实战 Lab 场景化       | 第 12 章接入 `agent-brief-forge` 的空泛委托、可观察目标、安全边界、验收路径、风险回滚和交付格式复盘                                                        | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R67  | 第 13 章实战 Lab 场景化       | 第 13 章接入 `delivery-review-court` 的交付说明、Diff 范围、过期测试、移动端缺口、文档同步和拒收决定复盘                                                   | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R68  | 第 14 章实战 Lab 场景化       | 第 14 章接入 `release-readiness-gate` 的上线计划、生产变量、备份恢复、桌面/390px 冒烟、监控信号和回滚方案复盘                                              | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R69  | 第 15 章实战 Lab 场景化       | 第 15 章接入 `interview-answer-forge` 的项目素材库、STAR、故障复盘、技术取舍、追问演练和答辩 Rubric 复盘                                                   | `npm run verify` + 浏览器桌面/390px 验收                | 通过 |
| R70  | 面试作品集 Markdown 出口      | 面试复盘册可打开独立作品集页，把 15 章路线素材和用户五段复盘草稿整理成可复制 Markdown                                                                      | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R71  | 本地备份库                    | 任务简报可导出/恢复 SQLite 学习记录和成长档案 JSON，不包含真实项目源码或账号信息                                                                           | API 恢复测试 + 主流程测试 + 浏览器验收                  | 通过 |
| R72  | 任务简报首屏节奏修复          | 左侧身份、路线目标、伙伴和复盘入口从首屏开始展示；右侧 15 章主线改为可滚动任务册，避免用户一打开被长列表淹没                                               | `npm run verify:quick` + Chrome 桌面/390px 验收         | 通过 |
| R73  | 章节卷宗舞台化                | 选中章节后展示随章节变化的地点背景、角色/宠物/装备图、事故导入和流程接力，减少纯文字卷宗感                                                                 | `npm run verify:quick` + Chrome 桌面/390px 验收         | 通过 |
| R74  | 章节向导与证据交接            | 章节卷宗舞台增加向导登场、开场对白、玩家目标和“谁把什么交给谁”证据接力板；点击章节后自动滚到卷宗，减少迷路                                                 | `npm run verify:quick` + Chrome 桌面/390px 验收         | 通过 |
| R75  | 项目地图向导化                | 教学桥项目地图新增地图向导、阅读顺序和当前节点接力解释，把“节点列表”改成继续办案的流程学习                                                                 | `npm run verify:quick` + Chrome 桌面/390px 验收         | 通过 |
| R76  | 概念卡术语解锁化              | 教学桥概念卡新增术语解锁室、角色图和“先类比、再项目、后判断”的引导，减少普通课程卡片感                                                                     | `npm run verify:quick` + Chrome 桌面/390px 验收         | 通过 |
| R77  | 代码导读巡读官                | 教学桥代码导读新增巡读官、阅读契约和三步阅读顺序，强调先看上一棒材料、再看关键行、最后找反证和交接证据                                                     | `npm run verify:quick` + Chrome 桌面/390px 验收         | 通过 |
| R78  | 剧情线索归档态                | 已发现线索改为“卷宗已收录”完成态并禁用重复点击，减少用户和自动化验收在同一线索上绕圈                                                                       | 主流程测试                                              | 通过 |
| R79  | 下一地点预告                  | 当前地点线索找齐后展示下一幕地点、登场角色和学习目标，避免用户只看到一个跳转按钮而不知道为什么换场景                                                       | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R80  | 场景转移字幕                  | 点击前往下一地点后短暂显示“场景转移”字幕和目的地名称，再切换场景，强化剧情推进感                                                                           | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R81  | 本幕收获证据印记              | 每个地点线索找齐后自动汇总本幕学到的技能印记，让用户知道这一幕到底获得了什么能力                                                                           | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R82  | 本幕面试一句话                | 每个地点收获卡自动生成可讲给面试官的一句话，把证据线索转成复盘表达                                                                                         | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R83  | 本幕复盘三段式                | 每个地点收获卡新增“现象 / 证据 / 结论”复盘，把剧情线索转成新手能复述的判断骨架                                                                             | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R84  | 实战阶段路线罗盘              | 实战 Lab 顶部流程图新增“当前这一棒”，随阶段高亮谁把什么交给谁，减少从剧情进入真实练习时的断层                                                              | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R85  | 实战作答支架                  | 所有实战答题卡新增“我看到 / 它说明 / 下一步”三段式作答支架，帮助新手把证据写成可复述的排查表达                                                             | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R86  | 一键填入作答骨架              | 作答支架新增“填入骨架”按钮，只插入可填写的三段标题，不替用户生成答案，降低空输入框阻力                                                                     | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R87  | 提交前表达检查                | 实战答题卡新增“提交前检查”，实时提示是否写出证据、证据含义和下一步验证动作，帮助答案更像真实排查表达                                                       | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R88  | 表达完整度反馈                | 提交前检查新增“表达完整度 x/3”和完成提示，用户能看到答案是否已经具备保存继续的基本表达骨架                                                                 | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R89  | 表达缺口提示                  | 表达完整度未满时显示“还差：...”提示，直接告诉用户下一句应该补证据、补证明还是补验证动作                                                                    | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R90  | Agent 委托作答模式            | “给 Agent 写任务”步骤切换为“背景 / 边界 / 验收”委托支架，并填入可执行任务骨架，避免沿用排查题表达模板                                                      | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R91  | 实战结案舞台暗色化            | 实战提交后的成长档案从独立白色结果页改为暗色结案舞台，沿用当前章节背景、HUD、证据三格和下一步验收清单                                                      | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R92  | 任务简报分舱                  | 任务简报左侧改为“当前委托 / 伙伴图鉴 / 面试复盘 / 本地备份”房间切换，默认只展示第一章目标，减少首屏信息过载                                                | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R93  | 词库暗色卷宗化                | 全局词库从白色浮层改为暗色 RPG 随身词典，并补充 dialog 语义，术语解释继续作为新手随查小抄                                                                  | 教学桥测试 + 浏览器桌面/390px 验收                      | 通过 |
| R94  | 教学桥壳层暗色补齐            | 教学桥陪练清单、进度胶囊、重置按钮和通关庆祝背景统一回暗色档案馆 RPG 风格，避免后续步骤露出白色课程壳                                                      | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R95  | 代码逐行翻译具体化            | 代码导读页的逐行解释会结合当前输入/输出和流程位置说明每行接了什么材料、交出什么证据，不再大量出现泛化套话                                                  | 类型检查 + 教学桥浏览器验收                             | 通过 |
| R96  | 章节教学刷新恢复              | URL hash 支持 `#chapter-n` 直接恢复到对应章节教学桥；已有教学进度时跳过剧情探索并回到第一个未完成步骤                                                      | 主流程测试 + 浏览器刷新验收                             | 通过 |
| R97  | 章节奖励舞台接入              | 第 2-15 章教学完成后先进入 RPG 奖励舞台，展示解锁物、能力印记、下一章预告，再选择进入本章实战或回路线图                                                    | 主流程测试 + 浏览器桌面/390px 验收                      | 通过 |
| R98  | 第一章结案奖励化              | 主线 1-1 结案门补上档案馆记录员解锁、能力印记和第 2 章预告，再让用户选择继续主线或进入实战                                                                 | 第一章主流程测试 + 浏览器验收                           | 通过 |
| R99  | 完成态刷新不迷路              | 教学步骤已经 100% 完成时，刷新会直接回到教学完成庆祝入口，不再落回项目地图让用户误以为还要重做                                                             | 教学桥完成态测试 + 浏览器刷新验收                       | 通过 |
| R100 | 首页成长契约                  | 当前委托房间新增成长契约，展示当前身份、下一阶位、收集进度和下一位可解锁伙伴，让用户打开就知道成长方向                                                     | 首页主流程测试 + 浏览器桌面/390px 验收                  | 通过 |
| R101 | 解锁反馈动效                  | 成长契约、伙伴卡和奖励舞台增加轻量入场、光纹和主行动反馈，并支持系统减弱动效，强化“获得奖励/继续冒险”的手感                                                | 样式检查 + 浏览器桌面/390px 验收                        | 通过 |
| R102 | 教学桥剧情记忆线              | 教学桥正文前持续显示刚刚看过、当前这一棒和接下来，让用户在代码/概念/结案之间切换时不忘上一站和下一步                                                       | 教学桥单测 + 浏览器桌面/390px 验收                      | 通过 |
| R103 | 章节结案三格复盘              | 章节最后一步新增“工作里怎么用 / 证据链怎么验 / 面试怎么讲”三格卡片，把长段结论拆成可复述、可求职的表达                                                     | 教学桥单测 + 浏览器桌面/390px 验收                      | 通过 |
| R104 | 逐行翻译去泛化                | 代码导读逐行解释新增字段清单、对象字段、回调和方法调用识别，减少“继续加工材料”这类泛化句子                                                                 | 代码导读单测 + 浏览器桌面/390px 验收                    | 通过 |
| R105 | 结案 Agent 委托口令           | 章节结案页新增背景/边界/验收三句任务骨架，帮助用户把本章产出转成可交给 Agent 的下一步实战委托                                                              | 教学桥单测 + 浏览器桌面/390px 验收                      | 通过 |
| R106 | 章节结案导师舞台              | 章节结案页复用本章剧情角色，新增结案导师、导师台词和能力印记，避免最后一步退回普通报告页                                                                   | 教学桥单测 + 浏览器桌面/390px 验收                      | 通过 |
| R107 | 结算前夜过渡页                | 教学完成页从普通庆祝卡改为结算前夜舞台，复用本章导师并展示已收录证据和下一步边界                                                                           | 教学桥单测 + 浏览器桌面/390px 验收                      | 通过 |
| R108 | 实战前夜作战简报              | 陪练页新增导师、作战目标、安全边界和验收口径，用户进入沙盒前先知道要改什么、不能做什么、怎么证明完成                                                       | 教学桥单测 + 浏览器桌面/390px 验收                      | 通过 |
| R109 | 通用状态屏暗色化              | 启动加载、教学材料加载和服务错误页统一为暗色档案馆状态屏，避免刷新或异常时突然出现白色网页断层                                                             | 启动 loading 单测 + 浏览器桌面/390px 验收               | 通过 |
| R110 | 暗色基础样式去覆盖依赖        | 教学桥记忆线、结案导师、Agent 委托、结算前夜和陪练控件的默认样式直接改为暗色 RPG，不再先白底再靠覆盖变暗                                                   | CSS 搜索 + 全量 verify + 浏览器桌面/390px 验收          | 通过 |
| R111 | 实战 Lab 接力板               | 实战 Lab 在流程图下新增“上一棒交来 / 当前要证明 / 交给下一棒”和证据路线，帮助用户持续理解谁把什么交给谁                                                    | 主流程测试 + 全量 verify + 浏览器桌面/390px 验收        | 通过 |
| R112 | 实战作答新手先读卡            | 每个实战作答题新增“这题到底在问什么 / 先看哪里 / 不要怎么写”，先把题目翻译成人话再进入材料和输入框                                                         | 主流程测试 + 全量 verify + 浏览器桌面/390px 验收        | 通过 |
| R113 | 实战材料关键行聚焦            | 项目材料阅读器新增“先看这几行”和完整材料备查提示，避免新手第一眼硬啃整段代码或日志                                                                         | 主流程测试 + 全量 verify + 浏览器桌面/390px 验收        | 通过 |
| R114 | 成长档案迁移口令              | 实战通关后的成长档案新增工作复盘、Agent 委托和面试讲法三格，把结案证据转成可迁移表达                                                                       | 成长档案单测 + 全量 verify + 浏览器桌面/390px 验收      | 通过 |
| R115 | 多章节实战结算规则            | 服务端提交结算改为按场景读取必填作答步骤和 skillIds，第 2-15 章不再被第一章硬编码步骤挡住                                                                  | 服务端提交单测 + 全量 verify + 失败报告阻断验收         | 通过 |
| R116 | 本地备份覆盖恢复              | 学习记录导入从增量 upsert 改为覆盖恢复，恢复备份时会删除备份外的临时步骤、验证事件和能力证据                                                               | 备份恢复单测 + 全量 verify + 本地 API 覆盖验收          | 通过 |
| R117 | 失败测试报告译文              | 实战读取测试报告后会把最近一次红灯测试展示成“测试报告译文”，列出失败用例和原因，帮助新手知道下一步查哪里                                                   | 服务端报告单测 + 前端组件单测 + 全量 verify             | 通过 |
| R118 | 红灯导师式巡查提示            | 每条失败测试都会翻译成流程断点、优先查看材料和下一步修复/复测动作，帮助新手把红灯连回“谁把什么交给谁”                                                      | 前端组件单测 + typecheck + 全量 verify                  | 通过 |
| R119 | 备份库覆盖恢复文案            | 本地备份库前端恢复方式、恢复说明和成功提示对齐覆盖恢复语义，避免用户误以为导入会与当前学习记录合并                                                         | 备份库组件单测 + typecheck + 全量 verify                | 通过 |
| R120 | 备份覆盖确认门禁              | 覆盖恢复前必须勾选“我知道恢复会覆盖当前本地学习记录”，恢复按钮才可用，降低误覆盖学习进度的风险                                                             | 备份库组件单测 + typecheck + 全量 verify                | 通过 |
| R121 | 当前委托动态主线面板          | 当前委托房间根据成长档案显示下一章主线，并展示任务理由、流程接力、通关产出和解锁奖励，避免通关后仍停在第一章                                               | 首页主流程测试 + typecheck + 全量 verify                | 通过 |
| R122 | 首页 HUD 下一章同步           | 顶部路线状态从固定 01 当前章节改为动态下一章编号，通关第 1 章后会显示 02 下一章，与当前委托保持一致                                                        | 首页状态单测 + typecheck + 全量 verify                  | 通过 |
| R123 | 实战案件路线牌                | 实战 Lab 从关卡配置自动生成事故来源、完整路线、第一眼证据和最终交付，帮助用户进入练习前先理解本关工作链路                                                  | 主流程测试 + 全量 verify + 浏览器入口验收               | 通过 |
| R124 | 教学桥旧组件暗色兜底          | 教学桥内的流程详情、预测题、补课面板、观察引用和庆祝提示增加暗色作用域覆盖，降低旧白底基础样式露出的风险                                                   | CSS 审计 + 全量 verify                                  | 通过 |
| R125 | 教学桥能力护照                | 教学桥在记忆线和当前步骤之间展示正在训练的工作能力、真实工作用法、证据工具和面试产出，持续提醒用户为什么学                                                 | 教学桥单测 + 全量 verify                                | 通过 |
| R126 | 能力护照 Agent 协作补强       | 能力护照新增“Agent 协作”卡，持续提示背景、边界和验收三件套，避免用户只学排查而忘记如何把任务交给 Agent                                                     | 教学桥单测 + 全量 verify                                | 通过 |
| R127 | Agent 委托骨架可操作化        | 能力护照内新增“Agent 委托骨架”，自动生成背景、边界、验收三句示例，让用户知道如何把当前学习站点交给 Agent                                                   | 教学桥单测 + 全量 verify                                | 通过 |
| R128 | 能力护照验收动作补强          | 能力护照新增“验收动作”卡，持续提示用户要用证据证明当前路线成立，避免只看剧情或概念就误以为已经掌握                                                         | 教学桥单测 + 全量 verify                                | 通过 |
| R129 | 能力护照面试复盘骨架          | 能力护照的面试产出卡新增“现象 / 证据 / 行动 / 验证”四段骨架，帮助用户把每章学习结果转成面试材料                                                            | 教学桥单测 + 全量 verify                                | 通过 |
| R130 | 能力护照骨架复制              | 能力护照的 Agent 委托骨架和面试复盘骨架新增一键复制，用户能把当前关卡产物直接带去写 Agent 任务或面试稿                                                     | 教学桥单测 + 全量 verify                                | 通过 |
| R131 | 教学桥流程回放                | 教学桥在冒险日志后新增“本章流程回放”，从项目地图自动生成完整传递路线，并高亮当前站点、证据和下一棒                                                         | 教学桥单测 + 全量 verify                                | 通过 |
| R132 | 教学桥导师同行                | 教学桥顶部新增“本章导师同行”，复用当前章节剧情角色、地点、导师台词和第一条线索，让教学页持续有角色代入感                                                   | 教学桥单测 + 全量 verify                                | 通过 |
| R133 | 导师试炼三印章                | 教学桥新增“导师试炼”，用户可点亮流程、证据、委托三枚印章，把被动阅读变成主动确认自己是否看懂当前这一棒                                                     | 教学桥单测 + 全量 verify                                | 通过 |
| R134 | 试炼完成回响                  | 三枚导师试炼印章全部点亮后显示完成回响、下一步和本步可带走的一句话，让闯关反馈从点击状态变成学习收束                                                       | 教学桥单测 + 全量 verify                                | 通过 |
| R135 | 试炼收获复制                  | 试炼完成回响新增“复制本步收获”，把步骤、流程、证据、Agent 委托和下一步整理成可带走的复盘文本                                                               | 教学桥单测 + 全量 verify                                | 通过 |
| R136 | 试炼面试一句话                | 试炼完成回响和复制文本新增“面试里可以说”表达，把每个教学步骤继续转成可复述的求职素材                                                                       | 教学桥单测 + 全量 verify                                | 通过 |
| R137 | 试炼收获三格                  | 试炼完成回响新增工作能力、Agent 委托、面试素材三格，让点满印章后的学习产出更容易扫读和复述                                                                 | 教学桥单测 + 全量 verify                                | 通过 |
| R138 | 本步能力印记                  | 试炼完成回响新增“获得能力印记”，把当前步骤标题转成即时奖励，并同步写入复制文本                                                                             | 教学桥单测 + 全量 verify                                | 通过 |
| R139 | 试炼奖励动效                  | 试炼完成回响和能力印记新增轻量解锁动效，并接入 `prefers-reduced-motion` 降低晃动                                                                           | CSS 审计 + 全量 verify                                  | 通过 |
| R140 | 导师试炼缺口提示              | 导师试炼未点满时显示还差哪些印章，帮助新手知道下一步该确认流程、证据还是委托                                                                               | 教学桥单测 + 全量 verify                                | 通过 |
| R141 | 15 章真实材料接力             | 路线 manifest 为每章记录实际传递材料；章节卷宗从“系统名接系统名”改为草稿 JSON、Token、检索命中、测试证据等真实交接物                                       | 主流程单测 + 全量 verify + 桌面/390px 浏览器验收        | 通过 |
| R142 | 第一章导师高质量立绘          | 用生成式位图替换档案馆记录员简化 SVG，并统一首页当前委托、章节卷宗、剧情探索、教学导师和结算阶段的角色呈现                                                 | 32 个相关前端测试 + 全量 verify + 桌面/390px 截图       | 通过 |
| R143 | 第 2–4 章角色与宠物立绘升级   | 第 2–4 章换成同画风的帅哥/美女导师立绘；灵感萤火换成奶油杏色可爱宠物，并修复宠物错误复用人物图的问题                                                       | 主流程单测 + 全量 verify + 桌面/390px 截图              | 通过 |
| R144 | 教学页单屏节奏专项            | 简报房间互斥显示；卷宗流程/锦囊渐进展开；伙伴手机端改用选择器；教学桥先显示当前任务，辅助资料默认收起                                                      | 64 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R145 | 第 5–9 章角色与宠物升级       | 幂等石灵、雾灯猫、检索狐升级为暖色可爱宠物；模型熔炉执钥人、镜厅校对师升级为同画风帅哥/美女导师，并使用压缩 WebP                                           | 64 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R146 | 第 10–12 章人物与图片优化     | 塔楼副官、验收试炼官、委托书锻造师升级为两男一女高质量导师；前 12 章生成角色/宠物统一压缩为 WebP                                                           | 64 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R147 | 第 13–15 章人物与场景优化     | 交付审查官、上线守门人、终章答辩官升级为同世界观导师；五张主场景背景压缩为 WebP；宠物视觉固定为暖色、圆润、亲近，不使用诡异形象                            | 64 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R148 | 教学伙伴动态同行              | 15 章解锁伙伴、宠物或装备进入教学桥；根据地图、术语、代码、证据和结案步骤给出不同的一句话行动提示与本步收获                                                | 64 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R149 | 伙伴证据收录过场              | 完成教学步骤后不再立即跳页；伙伴先收录本步目标、能力印记和下一站交接，用户确认后再继续，终步确认后进入章节结算                                             | 65 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R150 | 关键节点主动复述证据          | 流程地图和章节结案过场要求用户用自己的话复述交接链或验收证据；原文保存到本地教学记录，不评分、不直接判定掌握                                               | 65 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R151 | 主动复述进入复盘与作品集      | 只读 API 聚合各章主动复述；复盘房间和作品集分别展示用户原话与路线参考，Markdown 可带走原话；手机端用章节选择器避免滚过 15 章列表                           | 65 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R152 | 证据驱动的成长结算            | 剧情完成只进入伙伴会合，不发 XP、不记通关；服务端接受实战提交后才结算 XP、阶位和伙伴正式归队，复习不重复发放                                               | 66 条测试 + 全量 verify + 桌面/390px 浏览器验收         | 通过 |
| R153 | 第 3–5 章独立世界场景         | 身份回廊、接口审判庭、幂等锻造炉各有独立 WebP 背景，并贯穿章节入口、剧情关键地点、卷宗/会合与实战；中间地点继续换景                                        | 66 条测试 + 全量 verify + 三章桌面/390px 浏览器验收     | 通过 |
| R154 | 第 6–9 章 AI 核心世界场景     | 性能观测站、模型密钥熔炉、幻觉镜厅、RAG 知识迷宫各有独立 WebP 背景并贯穿主要路径；装备章由对应人物会合并在通关后交付装备                                   | 66 条测试 + 全量 verify + 四章桌面/390px 浏览器验收     | 通过 |
| R155 | 第 10–12 章 Agent 协作场景    | 工具契约大厅、验收试炼场、委托书锻造工坊各有独立 WebP 背景并贯穿主要路径；场景工程隐喻分别对应权限、证据链和任务结构                                       | 66 条测试 + 全量 verify + 三章桌面/390px 浏览器验收     | 通过 |
| R156 | 第 13–15 章职业闭环场景       | 交付审查庭、上线城门、终章答辩厅各有独立 WebP 背景并贯穿主要路径；结算前夜补回教学桥暗色外壳和本章最后地点背景                                             | 66 条测试 + 全量 verify + 三章桌面/390px 浏览器验收     | 通过 |
| R157 | 15 章教学契约与事实校准       | 清理第 13–15 章对旧完成状态的错误陈述；逐章自动验证剧情、工作背景、流程、名词、代码、证据、Agent、验收和面试复盘九件套                                     | 80 条测试 + 全量 verify + 第 13/15 章浏览器抽检         | 通过 |
| R158 | 教学桥首屏按需加载            | `TeachingBridge` 改为动态导入，并用暗色章节加载画面承接慢速网络；首页不再提前下载完整教学桥，进入章节时才加载                                              | 80 条测试 + 全量 verify + 首页/第 13 章请求验收         | 通过 |
| R159 | 微知识补课闭环                | 第一章四张概念卡接入“我有点卡住”；术语、语法、项目位置和因果四类补课改为结构化内容，并用单屏专注弹层支持切换和原位返回                                     | 81 条测试 + 全量 verify + 桌面/390px 补课交互验收       | 通过 |
| R160 | 第 2–5 章专属补课             | 项目委托、登录状态、接口错误与幂等四章分别接入术语、代码动作、项目位置和故障因果补课；内容由教学桥按需加载，不增加首页主包                                 | 90 条测试 + 全量 verify + 三章桌面/390px 补课验收       | 通过 |
| R161 | 第 6–9 章 AI 核心补课         | 性能定位、AI API、幻觉控制与 RAG 四章分别接入专属四类补课；用户可沿时间、密钥、引用与检索证据回到完整工程链路                                              | 98 条测试 + 全量 verify + 两章桌面/390px 补课验收       | 通过 |
| R162 | 第 10–12 章 Agent 协作补课    | Agent 工具、测试证据与任务委托三章分别接入专属四类补课；用户可沿安全门、验收链和委托五件套理解真实协作边界                                                 | 104 条测试 + 全量 verify + 两章桌面/390px 补课验收      | 通过 |
| R163 | 第 13–15 章职业闭环补课       | 交付审查、上线准备与面试表达三章分别接入专属四类补课；用户可沿审查证据、生产门禁和可追问表达理解完整职业闭环                                               | 110 条测试 + 全量 verify + 两章桌面/390px 补课验收      | 通过 |
| R164 | 第一章延迟变式复测            | 第一章实战提交 24 小时后解锁头像持久化新案件；使用不同业务、文件和证据重新检查独立诊断、证据计划、Agent 委托与验证反思，不把单次通过冒充完全掌握           | 113 条测试 + 全量 verify + 桌面/390px 浏览器验收        | 通过 |
| R165 | AI 主线终章授勋与后续行动     | 十五章全部通关后进入职业授勋房间，不再把第十五章显示成下一章；地图和任务卡读取真实通关状态，旧档案自动补回已通关章节伙伴，并提供复盘、作品集和迁移复测出口 | 115 条测试 + 全量 verify + 桌面/390px 终局验收          | 通过 |
| R166 | 复访玩家归城继续入口          | 只有零进度新用户播放失忆序章；已有进度的玩家由当前章节导师直接接引，十五章通关玩家由终章答辩官打开职业档案，不再被迫重选证据或重复领取委托                 | 115 条测试 + 全量 verify + 桌面/390px 归城验收          | 通过 |
| R167 | 跨岗位核心能力迁移路线        | 将读项目、追数据流、定位故障、读取证据、委托 Agent、验收交付和面试表达建成共享事实源；锁定岗位用单屏预告解释 AI 章节如何迁移，不再混入 AI 长任务板         | 116 条测试 + 全量 verify + 桌面/390px 路线验收          | 通过 |
| R168 | 第二章延迟复测与镜头地图契约  | 第二章实战 24 小时后解锁 AI 会议助手新业务；复测工作台按场景配置加载，第一章线性回声廊与第二章工坊取舍图使用不同地图拓扑、进入镜头、导师和证物             | 119 条测试 + 全量 verify + 桌面/390px 入口验收          | 通过 |
| R172 | 第三章登录态延迟迁移复测      | 第三章实战 24 小时后解锁客服夜班新业务；认证服务重启故障使用独立沙盒、证物、会话回环地图、检查点跟拍镜头和导师                                             | 128 条测试 + 全量 verify + 桌面/390px 浏览器验收        | 通过 |
| R173 | 第四章接口限流延迟迁移复测    | 第四章实战 24 小时后解锁 AI 客服摘要限流事故；使用独立沙盒、跨层证物、故障分流地图、告警下潜镜头、导师与机械猫头鹰                                         | 130 条测试 + 全量 verify + 桌面/390px 浏览器验收        | 通过 |
| R174 | 第五章索引并发延迟迁移复测    | 第五章实战 24 小时后解锁 RAG 双 Worker 竞争事故；使用独立沙盒、并发时间线、双轨汇流地图、环绕镜头、导师与机械兔                                            | 132 条测试 + 全量 verify + 桌面/390px 浏览器验收        | 通过 |
| R175 | TeachingBridge 按需加载防回退 | 生产 manifest 必须把教学桥保留为独立动态入口；首页静态依赖图不能包含教学桥，构建时自动检查，避免合并时恢复同步导入                                         | 134 条测试 + 构建门禁 + 首页/章节网络验收               | 通过 |
| R176 | 第七章密钥轮换延迟迁移复测    | 第七章 AI API 实战完成 24 小时后解锁模型密钥熔炉；使用独立沙盒、浏览器密钥扫描、服务端环境变量、上游 401、错误兜底、导师和边界地图                         | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |
| R177 | 第八章引用可验证回答延迟复测  | 第八章幻觉控制实战完成 24 小时后解锁引用失真的客服回答；使用独立沙盒、资料与引用证物、拒答边界、镜厅校对师和引用镜面地图                                   | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |
| R178 | 第九章 RAG 检索版本错配复测   | 第九章 RAG 实战完成 24 小时后解锁旧版本命中事故；使用独立沙盒、Chunk 来源、TopK 命中、版本过滤、检索狐和知识迷宫地图                                       | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |
| R179 | 第十章 Agent 工具边界复测     | 第十章 Agent 实战完成 24 小时后解锁内部路径越权事故；使用独立沙盒、工具注册表、Schema、权限审计、失败回退、塔楼副官和高塔地图                              | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |
| R180 | 第十一章可信验收证据复测      | 第十一章验收实战完成 24 小时后解锁旧源码全绿报告事故；使用独立沙盒、失败复现、自动化/手动证据、源码指纹、验收试炼官和竞技场地图                            | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |
| R181 | 第十二章 Agent 委托契约复测   | 第十二章 Agent 委托实战完成 24 小时后解锁批量导入边界事故；使用独立沙盒、背景目标、允许范围、验收回滚、委托书锻造师和契约地图                              | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |
| R182 | 第十三章交付证据审查复测      | 第十三章交付审查实战完成 24 小时后解锁旧测试/移动端/文档缺口事故；使用独立沙盒、Diff 范围、源码版本、审查官和审查庭地图                                    | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |
| R183 | 第十四章上线门禁复测          | 第十四章上线前夜实战完成 24 小时后解锁备份恢复/移动端/监控缺口事故；使用独立沙盒、上线守门人、门锁镜头和上线安全地图                                       | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |
| R184 | 第十五章面试证据复测          | 第十五章终章答辩实战完成 24 小时后解锁新事故表达；使用独立沙盒、STAR、故障复盘、技术取舍、追问、答辩官和面试证据星图                                       | 定向测试 + 沙盒 2/1 失败报告 + 全量 verify + 浏览器验收 | 通过 |

## 接下来任务

### P0：让第一章真的像“闯关”

- [x] 把主线 1-1 拆成明确小关状态：项目委托、勘察现场、获得技能、读关键代码、写出判断、沙盒修复、成长档案。
- [x] 每个小关显示“目标、当前动作、通关产出”，避免用户不知道自己在干什么。
- [x] 增加角色身份、世界观和地图节点，让用户进入时有“扮演一个角色”的感觉。
- [x] 增加序章剧情和比喻式讲解，把前端、接口、数据库、Agent 转成舞台、传送门、档案馆、副官。
- [x] 把入口拆成“开场 CG → 剧情选择 → 任务简报 → 进入主线”，避免所有信息堆在一个界面。
- [x] 降低泛用 AI 页面感：去掉大面积蓝绿渐变和胶囊卡片，把入口 UI 改成档案馆世界观控件。
- [x] 把主线 1-1 学习桥改成地点探索：每个地点有独立图片、剧情对白、探索点和线索解锁。
- [x] 给主线 1-1 增加完整数据流路线图，持续展示用户→前端→后端接口→数据层→数据库→验收的关系。
- [x] 线索点击后同步高亮当前流程节点，解释 `response.ok`、201 和 SELECT 分别能证明什么。
- [x] 通关后给出下一步选择：进入实战、预览主线 1-2。
- [x] 主线 1-2 改成基于 CanvasStorm 产品链路的剧情关卡，并为初学者补名词小抄、最小链路片段和求职表达提示。
- [x] 主线 1-2 可从路线卷宗直接进入；教学桥底层数据已从登录态 Token/Cookie 残留改成 Project Brief、方向筛选、候选取舍和会话保存。
- [x] 实战 Lab 读取项目材料页改成暗色档案馆 RPG，不再出现白色后台风格断层。
- [x] 代码阅读页增加“这一棒在流程哪里”的导览，解释当前代码能证明什么、不能证明什么。
- [x] 教学桥后半段统一暗色 RPG 风格，流程图、概念卡、代码导读和补课面板不再跳回白色后台。
- [x] 代码导读页增加阅读罗盘、流程梯、逐行翻译、证据边界和“交给 Agent”话术，避免一次甩整段代码。
- [x] 导师试炼未点满时显示还差哪些印章，点满后自动收起，减少新手不知道下一步该确认流程、证据还是委托。
- [x] 15 章流程接力写清真实材料；第一章明确展示“当前草稿 → POST JSON → 校验对象 → INSERT → 数据库记录”，不再用“前端、接口、数据库”冒充交接物。
- [x] 第一章档案馆记录员升级为高质量男性导师位图，首页、剧情、教学和结算共用同一角色资产；桌面与 390px 均按脸部优先裁切。
- [x] 教学页单屏节奏专项：简报不同房间不再与路线图同时出现；章节卷宗把流程证据和工作锦囊改为就近展开；伙伴页 390px 用选择器；教学桥让当前任务先于辅助资料出现。
- [x] 首页展示 15 章主线卷轴，让用户知道目标是走向能独立工作和面试，而不是只做两个关卡。
- [x] 把路线从首页组件抽成 `src/careerRoadmap.ts` manifest，后续关卡不再散落在 UI 里。
- [x] 任务简报增加章节卷宗交互：点击后续章节可看到剧情、工作背景、流程、名词、代码焦点、证据、Agent 协作、验收和面试复盘。
- [x] 第 3 章从章节卷宗接入“身份回廊”剧情教学入口，解释 Cookie、Token、Session、401 和刷新掉登录的证据链。
- [x] 第 4 章从章节卷宗接入“接口审判庭”剧情教学入口，解释请求体、状态码、结构化错误和后端日志如何共同定位接口失败。
- [x] 第 5 章从章节卷宗接入“一致性熔炉”剧情教学入口，解释重复提交、Idempotency-Key、唯一约束、事务和数据库记录数验收。
- [x] 第 6 章从章节卷宗接入“慢速迷雾”剧情教学入口，解释 Network 瀑布图、TTFB、渲染卡顿、缓存和性能复测。
- [x] 第 7 章从章节卷宗接入“模型熔炉”剧情教学入口，解释 API Key、环境变量、服务端转发、流式响应和错误兜底。
- [x] 第 8 章从章节卷宗接入“幻觉镜厅”剧情教学入口，解释 Prompt、上下文资料袋、引用校验和无资料拒答。
- [x] 第 9 章从章节卷宗接入“知识迷宫”剧情教学入口，解释资料来源、chunk、embedding、topK 命中和带引用回答。
- [x] 第 10 章从章节卷宗接入“工具契约大厅”剧情教学入口，解释工具注册表、参数 schema、权限门禁和失败回退。
- [x] 第 11 章从章节卷宗接入“验收试炼场”剧情教学入口，解释复现用例、单元测试、集成测试、手动测试报告和回归风险。
- [x] 第 12 章从章节卷宗接入“委托书工坊”剧情教学入口，解释背景、目标、约束、验收、风险和 Agent 协作委托。
- [x] 第 13 章从章节卷宗接入“交付审查庭”剧情教学入口，解释交付说明、Diff、测试证据、边界条件、文档同步和拒收理由。
- [x] 第 14 章从章节卷宗接入“上线前夜”剧情教学入口，解释上线计划、环境变量、数据备份、监控哨塔、回滚条件和冒烟验收。
- [x] 第 15 章从章节卷宗接入“终章答辩厅”剧情教学入口，解释 STAR、故障复盘、技术取舍、成长证据和追问演练。
- [x] 路线 manifest 增加伙伴/宠物/装备解锁物，首页任务卡和章节卷宗展示每章可收集奖励。
- [x] 首页任务简报增加“伙伴图鉴”，直接展示 15 章可收集角色、宠物、装备及当前状态。
- [x] 通关后增加章节结算页：展示 XP、阶位变化、伙伴/宠物/装备解锁、能力印记、面试复盘和证据边界。
- [x] 成长档案记录已通关章节和已解锁角色，复习已通关章节不会重复刷能力分。
- [x] 首页增加“伙伴背包/收藏册”，支持全部、已收集、可获取筛选，并展示每个解锁物对应的能力印记、工作场景和面试复盘。
- [x] 增加真正的收藏册/伙伴背包，把已通关解锁物持久化到成长档案。
- [x] 成长档案页增加面试复盘结构：现象、定位证据、行动/修改、验证动作、可迁移经验。
- [x] 通关后补充独立复盘页，支持用户整理自己的回答。
- [x] 面试复盘册增加作品集出口：把 15 章复盘草稿生成 Markdown，标明学习边界，可复制到面试准备文档。
- [x] 任务简报增加本地备份库：导出/恢复 SQLite 学习记录和成长档案 JSON，换设备也能恢复证据线。
- [x] 修复任务简报首屏节奏：身份目标、伙伴收集和复盘入口不再被 15 章长列表拖到页面中段；主线卷轴在桌面和 390px 手机上都以任务册滚动区呈现。
- [x] 章节卷宗增加“剧情舞台”：点击不同章节会切换地点背景、角色/宠物/装备图，并把本章 `flow` 自动拆成初学者能读懂的流程接力。
- [x] 章节卷宗增加向导开场、玩家目标和“谁把什么交给谁”证据接力板，用户进入关卡前能先理解本章流程。
- [x] 点击后续章节后自动滚到选中章节卷宗，避免用户点完任务卡却看不到舞台变化。
- [x] 教学桥项目地图增加“地图向导”和三步阅读顺序，让剧情探索结束后不会突然掉回普通课程页。
- [x] 项目地图节点详情增加“这一站的接力”，用输入、输出和证据解释当前节点在完整流程中的职责。
- [x] 教学桥概念卡增加“术语解锁室”和角色图，把生活类比、项目例子、预测题串成一个解锁流程。
- [x] 教学桥代码导读增加“代码巡读官”和三步阅读契约，让用户知道这一页只读当前几行、它接了谁的材料、交给谁继续验收。
- [x] 教学桥旧基础组件增加暗色兜底覆盖，流程详情、预测题、补课面板、观察引用和庆祝提示不会在暗色 RPG 壳层里露出白底。
- [x] 教学桥新增“能力护照”，持续展示当前训练能力、工作里怎么用、证据工具和面试产出，避免用户只跟剧情走却忘了学习目的。
- [x] 能力护照新增“Agent 协作”卡，提示背景、边界、验收三件套，让用户从教学阶段就知道后面如何把任务交给 Agent。
- [x] 能力护照内新增“Agent 委托骨架”，自动用当前站点和证据工具生成背景、边界、验收三句示例，降低用户写 Agent 任务的开口难度。
- [x] 能力护照新增“验收动作”卡，持续提示用户要用证据证明当前路线成立，而不是只看完剧情或概念。
- [x] 能力护照的面试产出卡新增“现象 / 证据 / 行动 / 验证”复盘骨架，帮助用户把每章学习结果转成面试材料。
- [x] 能力护照的 Agent 委托骨架和面试复盘骨架支持一键复制，让学习产物能直接带去委托 Agent 或整理面试稿。
- [x] 教学桥新增“本章流程回放”，把项目地图自动转成完整传递路线，并持续高亮当前站点、证据和下一棒。
- [x] 教学桥新增“本章导师同行”，复用每章剧情角色、地点和导师台词，让教学步骤不再像脱离剧情的课程页。
- [x] 教学桥新增“导师试炼三印章”，让用户主动点亮流程、证据、委托三项理解检查，增加闯关反馈和学习自检。
- [x] 导师试炼三印章点满后新增“试炼完成”回响，提示下一步和本步能带走的流程/证据表达。
- [x] 试炼完成回响新增“复制本步收获”，把当前步骤的流程、证据、Agent 委托和下一步整理成可带走复盘文本。
- [x] 试炼完成回响新增“面试里可以说”一句话，并写入复制文本，让每个教学步骤都能转成求职复述素材。
- [x] 试炼完成回响新增工作能力、Agent 委托、面试素材三格，让点满印章后的学习产出更容易扫读和复述。
- [x] 试炼完成回响新增“获得能力印记”，把当前步骤转成即时奖励，并写入复制文本。
- [x] 试炼完成回响和能力印记新增轻量解锁动效，并遵守系统减弱动效设置。
- [x] 实战 Lab 新增“案件路线牌”，进入每章练习前先展示事故来源、谁把什么交给谁、第一眼证据和最终交付，避免新手看到材料后不知道整关在追哪条工作链路。

验收：用户不看说明也能知道下一步点哪里、为什么做、做完有什么产出。

### P1：补 AI 应用开发主线内容

目标不是堆课程，而是让用户一路练成“能接真实工作、能跟 Agent 协作、能解释交付、能面对面试追问”的开发者。

当前进度：15 章已经有 manifest 和可点击卷宗；第 1 章到第 15 章已经接入各自专属 UI 实战 Lab。第 2 章已有 CanvasStorm Product Brief 种子沙盒；第 3 章已有 Identity Session Corridor 登录态种子沙盒，并接入身份路线、凭证存储、401 反证、Agent 委托和面试复盘。第 4 章已有 API Error Court 接口错误种子沙盒，并接入请求体检查、状态码判定、结构化错误、日志串证、Agent 委托和接口排障复盘。第 5 章已有 Data Consistency Forge 数据一致性种子沙盒，并接入重复提交、幂等键、唯一约束、事务边界、Agent 委托和数据一致性面试复盘。第 6 章已有 Performance Fog Lab 性能排查种子沙盒，并接入瀑布图阅读、Server-Timing、渲染画像、缓存复测、Agent 委托和性能瓶颈面试复盘。第 7 章已有 AI API Key Vault 安全接入种子沙盒，并接入前端密钥扫描、服务端环境变量、流式响应、失败兜底、Agent 委托和 AI API 安全面试复盘。第 8 章已有 Hallucination Mirror Hall 可验证回答种子沙盒，并接入 Prompt 合约、上下文资料、编造引用、无资料拒答、Agent 委托和幻觉控制面试复盘。第 9 章已有 RAG Knowledge Maze 检索种子沙盒，并接入 chunk 来源、topK 命中、matches/citations、未命中拒答、Agent 委托和 RAG 面试复盘。第 10 章已有 Agent Tool Tower 工具调用种子沙盒，并接入工具注册表、schema 校验、权限门禁、失败回退、审计日志、Agent 委托和 Agent 工具面试复盘。第 11 章已有 Verification Trial Arena 验收试炼种子沙盒，并接入失败复现、单元边界、集成流程、手动复测、过期报告、回归风险、Agent 委托和可信验收面试复盘。第 12 章已有 Agent Brief Forge 委托书种子沙盒，并接入空泛委托、可观察目标、安全边界、验收路径、风险回滚、交付格式、Agent 委托和面试复盘。第 13 章已有 Delivery Review Court 交付审查种子沙盒，并接入交付说明、Diff 范围、过期测试、移动端缺口、文档同步、拒收决定、Agent 补证要求和面试复盘。第 14 章已有 Release Readiness Gate 上线门禁种子沙盒，并接入上线计划、生产变量、备份恢复、桌面/390px 冒烟、监控信号、回滚方案、Agent 补证任务和上线面试复盘。第 15 章已有 Interview Answer Forge 答辩作品集种子沙盒，并接入项目素材库、STAR、故障复盘、技术取舍、追问演练、答辩 Rubric、Agent 面试官和终章面试复盘。首页面试复盘册已能打开作品集页，把 15 章路线素材和用户填写的五段复盘草稿整理成可复制 Markdown，并明确学习项目边界。任务简报已增加本地备份库，可把 SQLite 学习记录和成长档案导出为本地 JSON，并通过白名单表恢复。

后续开发目标不是“再加几个页面”，而是把 15 章主线继续做深：每章都要从剧情教学升级到可探索、可练习、可复盘、可验收的职业成长关卡。用户最终要能独立面对工作中的需求、排障、Agent 协作、交付审查、上线风险和面试追问。每一章上线时都必须同时满足：

- 剧情入口：有独立地点、角色/伙伴、冲突事件和选择反馈。
- 知识讲解：用初学者能理解的比喻解释流程，不只堆术语。
- 真实材料：绑定代码片段、日志、Network、数据库、测试或项目文档中的至少一种证据。
- 操作练习：用户必须做一次判断、修复、设计、验收或复盘，不能只看完文字。
- 求职产出：通关后沉淀一句能在面试里讲清楚的项目表达。
- 验收证据：自动化测试、浏览器主路径和移动端可用性必须通过；学习效果只能等真人试玩后判断。
- 岗位扩展：AI 应用开发是当前主线；Java 后端、前端工程等路线后续按岗位加载自己的关卡，不把所有用户塞进同一套内容。

最终能力目标分四段验收：

- 第 1-4 章：用户能看懂一个真实项目的基础请求链路，知道页面、接口、状态码、日志和数据库分别能证明什么。
- 第 5-7 章：用户能面对常见工作问题做初步判断，包括重复数据、性能瓶颈和 AI API 安全接入。
- 第 8-12 章：用户能把 AI 应用开发讲成工程链路，理解 Prompt、RAG、Agent 工具、测试证据和 Agent 委托边界。
- 第 13-15 章：用户能审查 Agent 交付、准备上线检查，并把项目经历整理成经得起追问的面试回答。

| 章  | 主题                | 工作能力                         | 面试产出                          | 验收目标                               |
| --- | ------------------- | -------------------------------- | --------------------------------- | -------------------------------------- |
| 1   | 数据为什么消失      | 前端、接口、数据库、持久化       | 一段完整保存链路排障复盘          | 能解释一次保存请求从页面到数据库怎么走 |
| 2   | AI 点子为什么空泛   | Brief、方向筛选、候选取舍        | 能把 AI 功能讲成产品链路          | 能说清用户目标、输入、输出和保存       |
| 3   | 登录状态为什么丢    | Cookie、Session、Token、状态同步 | 能解释登录态怎么保存、怎么失效    | 能用证据判断凭证是否保存和携带         |
| 4   | 接口为什么报错      | 参数、状态码、错误处理、日志     | 能讲清一次接口失败定位            | 能定位失败发生在前端、接口还是后端     |
| 5   | 数据为什么重复/错乱 | 唯一键、幂等、并发、事务基础     | 能解释重复提交和数据一致性        | 连续点击/重试不会产生重复核心数据      |
| 6   | 页面为什么慢        | 加载、渲染、接口耗时、缓存       | 能用证据讲性能瓶颈                | 能判断慢在前端还是后端                 |
| 7   | AI 接口怎么接       | API Key、环境变量、流式响应      | 能讲清 AI API 接入和失败兜底      | 能安全接入 AI API，不暴露密钥          |
| 8   | AI 回复为什么胡说   | Prompt、上下文、引用、幻觉控制   | 能说明为什么不能盲信模型输出      | 能设计一个可验证的 AI 输出流程         |
| 9   | RAG 知识库          | 文档切分、检索、引用、命中率     | 能解释检索增强和资料来源          | 能解释资料如何被找出并进入回答         |
| 10  | Agent 工具调用      | 工具边界、参数校验、失败回退     | 能解释 Agent 能做什么、不能做什么 | 能让 Agent 做事但不越权                |
| 11  | 测试怎么证明修好了  | 单测、集成测试、手动测试报告     | 能展示可信验收证据                | 能写出可信验收证据                     |
| 12  | Agent 任务怎么写    | 背景、目标、约束、验收、风险     | 能把用 Agent 讲成工程协作能力     | 能写一份清晰任务给 Agent               |
| 13  | 怎么审查交付        | Diff、回归风险、边界条件、文档   | 能说明为什么接收或拒绝交付        | 能判断 Agent 是否真的完成              |
| 14  | 上线前检查什么      | 配置、环境变量、数据备份、回滚   | 能回答上线失败怎么查、怎么退      | 能说出上线检查清单                     |
| 15  | 面试怎么讲项目      | STAR、故障复盘、技术取舍         | 一组可复用的面试回答              | 能把每关产出整理成面试回答             |

每条主线都必须绑定三类标签：

- 能展示：用户能指出一个真实产物或截图。
- 能解释：用户能讲清楚背后的数据流、边界或取舍。
- 能验收：用户能用测试、日志、数据库、Network 或人工复测证明结果。

验收：每个章节都有一个可运行沙盒或明确的真实材料练习，不靠纯文字假装学会。

### P1：Goal 模式执行目标

后续进入 Goal 模式时，默认目标不是“再加页面”，而是把 AI 应用开发主线做成能持续训练真实工作能力的 15 章职业 RPG。每次实现一章都必须交付一个纵向切片：剧情入口、真实材料、操作练习、求职复盘、测试证据和浏览器验收一起完成。

Goal 模式的完成口径必须比“能点进去”更严格：只接剧情教学不算完成，只放种子沙盒不算完成，只展示结算奖励也不算完成。每章完成时，用户必须能从章节卷宗进入剧情，理解流程，再进入本章自己的实战 Lab，看到本章自己的材料、提示、沙盒路径、手动测试说明和成长档案。

| 阶段 | 覆盖章节 | 目标能力                   | 本阶段交付物                                               | 每次验收目标                                                      |
| ---- | -------- | -------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| G1   | 1-2      | 看懂基础项目链路和产品链路 | 保存链路沙盒、CanvasStorm Brief 沙盒、卷宗教学、结算与复盘 | 用户知道谁把什么交给谁，能用 Network/日志/数据库/会话证据解释结果 |
| G2   | 3-4      | 独立定位登录态和接口失败   | 登录态沙盒、接口错误沙盒、401/400/500 证据包、初学者流程图 | 用户能判断问题发生在浏览器凭证、请求参数、后端校验还是业务逻辑    |
| G3   | 5-7      | 处理常见工作故障           | 幂等一致性沙盒、性能瓶颈沙盒、AI API 安全接入沙盒          | 用户能提出修复假设，并用测试、耗时数据或密钥扫描证明边界          |
| G4   | 8-10     | 做出可信 AI 应用链路       | 幻觉控制沙盒、RAG 检索沙盒、Agent 工具调用沙盒             | 用户能解释模型输出来自哪里、工具能做什么、失败时怎么兜底          |
| G5   | 11-13    | 像工程师一样验收 Agent     | 测试验收沙盒、Agent 任务委托沙盒、交付审查沙盒             | 用户能写任务、看 Diff、拒收不可信交付，并留下验收证据             |
| G6   | 14-15    | 面向上线和面试表达         | 上线检查沙盒、面试答辩作品集、导出/复盘入口                | 用户能讲清风险、回滚、项目贡献和可迁移经验                        |

每个 Goal 阶段完成前必须留下：

- 任务记录：本文件勾选对应章节，并在 `HANDOFF.md` 说明下一位 Agent 从哪里继续。
- 代码入口：`src/careerRoadmap.ts`、剧情教学数据、服务端场景注册和沙盒材料保持同一章节语义。
- 验证证据：定向测试、`npm run verify`、浏览器桌面和 390px 移动端主路径检查。
- 学习边界：自动化只能证明应用能用，不能声称真人已经学会；真人试玩结果单独进入 P2。

### P1：可运行沙盒落地顺序

- [x] 第 1 章“保存成功，刷新后没了”：已有完整 UI 实战闭环和 `canvas-save-persistence` 沙盒。
- [x] 第 2 章“AI 点子为什么空泛”：已有 `canvasstorm-product-brief` 种子沙盒、故障代码、证据材料、失败测试报告和专属 UI 实战 Lab。
- [x] 第 3 章“登录状态为什么丢”：已有 `identity-session-corridor` 种子沙盒和专属 UI 实战 Lab，材料包含登录响应、Cookie/Token 保存、401 Network、刷新恢复测试。
- [x] 第 4 章“接口为什么报错”：已有 `api-error-court` 种子沙盒和专属 UI 实战 Lab，材料包含请求体、参数校验、结构化错误、后端日志和错误提示验收。
- [x] 第 5 章“数据为什么重复/错乱”：已有 `data-consistency-forge` 种子沙盒和专属 UI 实战 Lab，材料包含重复点击、唯一约束、幂等 key、事务边界和数据库数量断言。
- [x] 第 6 章“页面为什么慢”：已有 `performance-fog-lab` 种子沙盒和专属 UI 实战 Lab，材料包含 Network 瀑布图、Server-Timing 缺失、渲染等待、缓存复测和前后对比数据。
- [x] 第 7 章“AI 接口怎么接”：已有 `ai-api-key-vault` 种子沙盒和专属 UI 实战 Lab，材料包含服务端密钥读取、前端无密钥扫描、流式响应和失败兜底测试。
- [x] 第 8 章“AI 回复为什么胡说”：已有 `hallucination-mirror-hall` 种子沙盒和专属 UI 实战 Lab，材料包含上下文资料、引用校验、无资料拒答和错误输出复测。
- [x] 第 9 章“RAG 知识库”：已有 `rag-knowledge-maze` 种子沙盒和专属 UI 实战 Lab，材料包含 chunk、mock 检索、topK 命中、引用来源和未命中处理。
- [x] 第 10 章“Agent 工具调用”：已有 `agent-tool-tower` 种子沙盒和专属 UI 实战 Lab，材料包含工具注册表、参数 schema、权限拒绝、失败回退、审计日志和 Agent 工具复盘。
- [x] 第 11 章“测试怎么证明修好了”：已有 `verification-trial-arena` 种子沙盒和专属 UI 实战 Lab，材料包含复现用例、单元测试、集成测试、手动报告、过期报告、回归风险和可信验收复盘。
- [x] 第 12 章“Agent 任务怎么写”：已有 `agent-brief-forge` 种子沙盒，材料包含背景、目标、约束、验收命令、浏览器路径、风险回滚和 Agent 交付格式检查。
- [x] 第 13 章“怎么审查交付”：已有 `delivery-review-court` 种子沙盒，材料包含交付说明、Diff 范围、过期测试、移动端缺口、文档同步和拒收理由。
- [x] 第 14 章“上线前检查什么”：已有 `release-readiness-gate` 种子沙盒，材料包含环境变量、数据备份、监控信号、冒烟测试和回滚条件。
- [x] 第 15 章“面试怎么讲项目”：已有 `interview-answer-forge` 种子沙盒，材料包含 STAR、故障复盘、技术取舍、追问演练和答辩 Rubric。

验收：每次新补一章沙盒，都要能从职业路线入口看懂背景，从服务端白名单读取材料，从沙盒测试生成报告，并在结算/复盘里转化成面试表达。

### P1：后续关卡落地顺序

- [x] 第 8 章“AI 回复为什么胡说”：做成“幻觉镜厅”关卡，训练 Prompt、上下文、引用和可验证输出。
- [x] 第 9 章“RAG 知识库”：做成“知识迷宫”关卡，训练文档切分、检索命中、引用来源和失败分析。
- [x] 第 10 章“Agent 工具调用”：做成“工具契约大厅”关卡，训练工具边界、参数校验、权限和失败回退。
- [x] 第 11 章“测试怎么证明修好了”：做成“验收试炼场”关卡，训练单测、集成测试、手动报告和回归风险。
- [x] 第 12 章“Agent 任务怎么写”：做成“委托书工坊”关卡，训练背景、目标、约束、验收、风险和交付格式。
- [x] 第 13 章“怎么审查交付”：做成“交付审查庭”关卡，训练交付说明、Diff 审查、测试证据、边界条件、文档和拒收理由。
- [x] 第 14 章“上线前检查什么”：做成“上线前夜”关卡，训练配置、环境变量、数据备份、监控和回滚。
- [x] 第 15 章“面试怎么讲项目”：做成“终章答辩厅”关卡，把前 14 章产出整理成 STAR、故障复盘和技术取舍回答。

阶段验收：

- 第 8-10 章通过后，用户应能解释一个 AI 功能从输入到模型、知识、工具再回到界面的完整链路。
- 第 11-13 章通过后，用户应能给 Agent 写任务、验证交付、审查风险，而不是被动接收结果。
- 第 14-15 章通过后，用户应能把项目经历讲成可求职、可面试、可复盘的证据链。

### P1：岗位路线加载

- [x] 抽象 AI 应用开发路线 manifest：15 章、状态、学习目标、验收、证据和面试复盘字段。
- [x] 抽象多岗位路线 manifest：岗位、章节、关卡、解锁条件、产出标签。
- [x] 首页只暴露简单岗位选择，不暴露复杂配置。
- [x] 已锁定路线显示“即将解锁”，避免用户误点进入空内容。
- [x] 保留共享核心能力：读项目、追数据流、定位故障、读取证据、写 Agent 任务、验收交付和面试表达均有跨岗位事实源及 AI 章节映射。

验收：新增 Java/前端路线时，不需要重写首页主流程。

### P2：学习效果验证

- [ ] 找真人完整走一遍主线 1-1。
- [ ] 记录卡点：看不懂、点错、目标不清、无法完成测试、不会复盘。
- [ ] 根据反馈更新 `docs/debt.md` 和任务优先级。
- [ ] 只有真人验收后，才允许写“学习效果通过”。

验收：反馈来自真实使用，而不是自动化测试推断。

### R185：首页首次认知路径分层

- [x] 审计序章「走进档案馆 → 调取现场证据 → 领取委托 → 当前主线」的真实浏览器路径。
- [x] 当前委托、故事角色、为什么要去、谁把什么交给谁、通关产出和主线按钮保持默认可见。
- [x] 延迟复测、第 2–15 章路线、四个角色比喻改为按需展开，避免首次进入时一次渲染整面信息墙。
- [x] Node 24 下通过 `npm run verify`，151 项测试通过；桌面和 390px 移动端无横向溢出。

验收：新用户进入任务简报后，先能回答「我现在要去哪、为什么去、完成后得到什么」，再自行打开路线图和辅助资料。

### R186：角色台词进入教学现场

- [x] 每个教学步骤继续使用对应场景的背景、人物和地点，不复用单一教学背景。
- [x] 将场景数据中的角色台词渲染为导师同行对话气泡，让剧情先解释“这一幕发生了什么”，再进入名词、代码和证据。
- [x] 步骤切换按场景 id 重新挂载导师面板，并播放轻量入场动画，避免人物换站时像静态卡片突然改字。
- [x] 不清空已有本地学习档案；全量测试和生产构建通过。

验收：进入任意未完成章节后，当前地点、角色台词、当前学习目标和证据入口同时可见；切换下一站时背景与人物随剧情变化。

### R187：地点切换入场动效

- [x] 新地点背景淡入并轻微缩放回位，避免场景切换像静态图片替换。
- [x] 当前角色立绘和对白气泡同步入场，强化“角色带你查案”的连续感。
- [x] 尊重 `prefers-reduced-motion`，减少动效模式下不播放新增过渡。
- [x] Node 24 下通过 `npm run verify`，151 项测试通过。

验收：切换教学步骤时，背景、角色和台词属于同一场景组，且不会造成内容跳动或横向溢出。

### R188：序章选择留下学习倾向

- [x] “先改后查 / 证据优先 / 委托副官”三种序章选择在任务简报中留下可见记录。
- [x] 每种选择给出不同的学习提醒：证据边界、事实串联或 Agent 委托边界。
- [x] 选择只影响剧情反馈和关注点，不改变本章必须完成的流程、证据和验收目标。

验收：用户选择后进入任务简报，能看到自己的开场倾向，并知道本关要补哪一种工作能力。

### R189：保存序章选择上下文

- [x] 第 1 章领取委托时，将 `openingChoice` 写入 `baseline-plan` 学习记录。
- [x] 记录保留原始选择，不把它当成能力等级或通关证据。
- [x] 已有 attempt 不重复覆盖；不清空用户本地学习档案。

验收：新建第 1 章委托时，baseline-plan 响应包含 openingChoice；复盘可以知道用户从哪种调试倾向进入任务。

### R190：教学现场连接真实工作

- [x] 每章路线 manifest 的 `workBackground` 传入教学桥。
- [x] 角色台词下方显示“工作里什么时候会遇到”，再进入术语、证据和关键代码。
- [x] 不新增抽象占位文案，直接复用 15 章工作背景事实源。
- [x] 151 项测试、生产构建和按需加载门禁通过。

验收：用户进入任意章节教学时，能在当前角色场景中先知道这项能力对应的真实工作问题。

### R191：刷新恢复序章倾向

- [x] 首页启动时读取当前 `baseline-plan` 的 `openingChoice`。
- [x] 合法值会恢复为序章选择状态，非法或旧记录安全回退为空。
- [x] 不覆盖既有记录，也不把叙事倾向混入能力评分。
- [x] 全量测试、构建和按需加载门禁通过。

验收：拥有选择记录的用户刷新后，任务简报仍能显示对应开场倾向。

### R192：旧档不伪造序章选择

- [x] 只有恢复到合法 `openingChoice` 时才显示开场倾向印记。
- [x] 没有该字段的历史 attempt 不会显示默认选择，避免污染用户的剧情记忆。
- [x] 全量测试和生产构建通过。

验收：旧档继续主线时不出现用户没有做过的选择记录。

### R193：场景与角色完整性审计

- [x] 15 章镜头契约包含独立地图拓扑、地貌、地标、色彩和镜头序列。
- [x] 15 章教学场景配置包含地点、角色、对白、导师说明和线索，不把章节标题当作剧情替代品。
- [x] 路线 manifest 为每章提供工作背景、流程、证据和面试产出。

验收：章节之间不仅换标题，教学入口能根据章节加载不同的地点、人物和镜头配置。

### R194：代码导读主交接卡

- [x] 在逐行解释前显示“谁把什么交给谁”：上一棒 → 当前代码 → 下一棒。
- [x] 用当前步骤真实的 `input` / `output` 生成白话说明，明确成功提示为什么还不能替代 Network、日志、数据库或测试证据。
- [x] 保留逐行“收到 / 动作 / 交出 / 证明”卡片，主交接卡只负责先建立全局心智模型。

验收：代码阅读页打开后，用户不需要自己拼接分散信息，就能先说出当前代码接收什么、处理什么、交给谁；`npm run verify:quick` 通过。

### R195：剧情连续性回声

- [x] 每个剧情地点显示上一幕回声，保留上一地点、角色和最后收录的证据。
- [x] 回声明确说明当前地点不是重新开始，而是继续验证上一幕交出的下一份证据。
- [x] 首幕显示序章委托，说明用户为什么进入代码城和本章要追踪的主问题。

验收：从第一幕进入第二幕后，用户能在当前屏幕直接回答“刚才发生了什么、谁留下了什么证据、现在为什么继续”。

### R196：伙伴线索即时回应

- [x] 用户收集线索后，当前章节伙伴或宠物即时出现并回应。
- [x] 回应同时显示角色图、线索名称和该线索证明的工程能力。
- [x] 不改变证据验收门槛，只增加剧情反馈和人话解释。

验收：收集第一条线索后，用户能看到“伙伴是谁、这条证据为什么重要、它对应什么能力”；`npm run verify` 通过。

### R197：伙伴默契与证据收集进度

- [x] 调查 HUD 显示当前伙伴/宠物的本幕默契进度。
- [x] 默契分子严格等于本幕已收集线索数，分母等于本幕线索总数。
- [x] 线索回应同步显示“默契印记”，让收集行为与能力证据形成可见成长反馈。

验收：收集 1/2 条线索时显示 `1/2`，收齐后才形成完整本幕默契；不使用 XP 或自评直接替代证据。

### R198：序章委托人入场

- [x] 序章警报对话框显示档案馆记录员立绘，让用户知道是谁发现异常、谁把委托交给自己。
- [x] 立绘与档案馆背景使用同一暗色金属/青绿色世界观，不引入另一套视觉语言。
- [x] 桌面端立绘与警报、正文和行动按钮共处一屏；390px 移动端改为正文上方小立绘且无横向溢出。
- [x] 入口测试覆盖角色可见性，浏览器已检查桌面和移动端实际画面。

验收：第一次打开序章时，用户不只看到一段抽象警报，还能直接看到“谁在向我求助”，并能继续走进档案馆。

### R199：本幕任务契约

- [x] 每个剧情地点在探索前直接显示“现在在哪、要找什么、找到后交给谁”。
- [x] 契约读取当前流程的真实 `payload`、下一站和白话说明，不另造一套与流程图不一致的文案。
- [x] 保留完整流程图供用户理解全局；契约只承担当前一幕的认知锚点，避免用户在地点切换后重新拼流程。
- [x] 桌面与移动端布局均保持可读，主线教学测试覆盖第一幕契约内容。

验收：进入任意剧情地点时，用户不用先读完整流程图，就能回答“我在哪里、我要找什么、找到后交给谁”。

### R200：任务契约连接真实工作

- [x] 本幕任务契约同时显示当前章节的真实工作现场，不把剧情问题变成脱离岗位的抽象谜题。
- [x] 工作背景继续来自路线 manifest 的 `workBackground`，与首页、导师面板和面试复盘使用同一事实源。
- [x] 第一章主流程测试确认任务契约同时包含当前流程和工作现场提示。

验收：用户进入剧情地点时，能同时说出“这幕在查什么”和“工作里为什么会遇到它”。

### R201：移动端路线目录前置

- [x] 移动端任务简报先显示完整 15 章路线目录，再显示当前委托的长说明。
- [x] 当前章节保持高亮，其他章节明确显示待练习，不把小关卡藏在页面深处。
- [x] 浏览器 390px 实测第一章节点出现在首屏区域，页面无横向溢出；桌面端布局不改变。

验收：用户打开移动端路线大厅时，第一眼能知道总共有多少关、当前在哪一关、后面还要经历什么。

### R202：路线节点可探索

- [x] 世界地图的 15 个章节节点变为可聚焦、可点击的路线入口。
- [x] 点击待练习章节只打开该章卷宗、角色和学习目标，不会绕过解锁条件直接进入实战。
- [x] 当前节点通过 `aria-pressed` 和视觉状态同步，键盘焦点也有清晰反馈。
- [x] 主流程测试覆盖从第一章节点切换到第二章卷宗。

验收：路线地图不只是静态编号，用户可以点开未来关卡了解剧情、能力和伙伴，但仍必须按顺序通关。

### R203：路线地图操作提示

- [x] 路线地图明确说明节点点击行为和实战解锁规则。
- [x] 提示与节点交互行为一致：可以查看卷宗，但只有当前章节进入实战。
- [x] 第一章路线入口测试覆盖提示文案。

验收：用户不需要猜测地图节点的作用，也不会误以为点击待练习章节就能绕过主线。

### R204：路线节点选中反馈

- [x] 当前查看的章节节点拥有独立的金色选中态，与“当前可进入”和“已通关”状态分开。
- [x] 选中态同时由 `aria-pressed` 和视觉边框表达，切换卷宗后不会丢失位置感。
- [x] 第一章入口测试覆盖第 2 章节点选中态。

验收：用户点开未来章节后，能从地图上立即看出自己正在查看哪一章。

### R205：每幕主动复述门槛

- [x] 每个剧情地点完成线索探索后，要求用户用自己的话复述“证据证明了什么、下一幕继续查什么”。
- [x] 复述按地点保存到当前关卡完成响应，切换地点前必须先封存本幕原话。
- [x] 明确标注“不评分”，不把字数、自评或单次复述直接当作能力晋级证据。
- [x] 第一章与第二章主流程测试覆盖复述填写、封存、地点切换和最终进入实战。

验收：用户不能只点击线索跳过理解动作；每个地点结束时都会留下自己的解释，便于后续复盘和真人学习效果观察。

### R206：剧情页信息分层

- [x] 剧情页首屏优先展示上一幕回声、本幕任务契约和当前地点，不再默认铺开全部流程卡片。
- [x] 完整流程改为可展开的“流程卷轴”，首幕自动展开建立全局认知，后续地点保留当前高亮棒位。
- [x] 保留完整流程、证据和名词解释，不以隐藏内容换取视觉简洁。
- [x] 第一章主流程测试与生产构建通过，移动端继续使用横向可读的流程轨道。

验收：用户先知道“我现在在哪、要找什么、找到后交给谁”，需要时再展开全链路，不必在大量信息之间来回找重点。

### R207：每幕判断分支

- [x] 每幕线索收齐后出现两个不惩罚的判断选项：先收下表面结果，或沿证据继续追踪下一棒。
- [x] 每个选择即时给出不同角色反馈，解释它能证明什么、还不能证明什么。
- [x] 选择状态使用 `aria-pressed` 表达，并随场景复述一并写入关卡完成记录。
- [x] 第一章完整剧情测试覆盖选择、反馈、复述封存和地点切换；全章节入口回归通过。

验收：用户不是只点线索拿奖励，而是要在每幕做一次工程判断；即使判断偏向表面结果，也会得到解释而不是失败惩罚。

### R208：地点 NPC 阵容

- [x] 场景显示使用地点级人物覆盖表，同一章节内不同地点可以由不同 NPC、伙伴或宠物登场。
- [x] 角色资产统一使用暗色魔法科技视觉：时间导航员、回声调查官、索引仲裁者、风暴调度员等人物与对应场景职责一致。
- [x] 当前地点卡、导师同行卡和下一地点预告统一读取同一套场景人物，避免角色图和台词错位。
- [x] 第一章到第十五章入口回归、类型检查和生产构建通过。

验收：玩家移动到新地点时，不只是背景换了，负责解释这一棒的人物也会登场；人物身份直接帮助玩家理解这一站要查什么。

### R209：伙伴图鉴成长预告

- [x] 未收集伙伴不再直接展示完整头像与能力，改为剪影、章节预告和明确的解锁条件。
- [x] 已收集伙伴保留能力印记、真实工作场景和面试复盘，确保收藏内容对应学习证据，而不是装饰奖励。
- [x] 筛选伙伴图鉴时自动选择当前筛选结果，避免列表和详情出现“看着选中了但内容没切换”的断层。

验收：玩家打开伙伴图鉴时，能立刻知道下一位伙伴来自哪一章、为什么值得解锁；未通关内容只提供学习方向，不伪装成已经掌握。

### R210：TeachingBridge 按需加载复核

- [x] `React.lazy`、暗色 `Suspense` 加载画面和生产动态入口门禁保持有效。
- [x] Node 24 下 `npm run verify` 通过：9 个测试文件、151 项测试、生产构建和懒加载防回退检查。
- [x] 当前真实浏览器的路线档案在 390px 下无横向溢出，控制台错误为空；验收没有重置用户的 15/15 通关档案。
- [ ] 仍需在独立首次学习数据空间补充请求级网络证据，并继续观察真人首次进入章节时是否理解加载与剧情转场。

验收：合并后不能把 `TeachingBridge` 恢复为首页静态导入；首页主包和章节教学包必须保持独立，且首次学习路径需要单独验收。

### R211：代码导读逐行巡读

- [x] 代码导读默认只显示当前一行，不再同时铺开同一段所有逐行解释。
- [x] 用户通过“上一行 / 下一行”推进，每一行都同时看到人话翻译和“收到、动作、交出、证明”交接单。
- [x] 完整文件仍保留为可选资料，避免隐藏真实代码范围；当前行号与总行数始终可见。
- [x] 第一章与第二章代码导读测试覆盖逐行推进、最后一行解释和证据边界；全量 152 项测试与生产构建通过。

验收：新手先理解一行代码在流程中接到什么、交出什么，再进入下一行；不需要一次记住整段语法，也不能把“看到了代码”误认为“证明了真实修复”。

### R212：首次学习验收隔离入口

- [x] `server/index.ts` 支持通过 `CODE_QUEST_PORT` 使用临时本地 API 端口，默认仍为 `4317`。
- [x] `vite.config.ts` 支持通过 `CODE_QUEST_API_TARGET` 指向临时本地 API，默认仍代理到 `4317`。
- [x] 使用临时 SQLite 和独立浏览器 origin 完成首页到第一章的首次用户浏览器验收；空白档案从 Lv.1 序章进入“证据优先”选择、领取委托和第 1 章主线入口，正式用户数据未被重置或污染。

验收：新用户路径必须在独立数据空间中验证，不能为了截图或测试清空真实学习档案。

### R213：线索回声回看

- [x] 已收录线索仍可点击回看完整结果、代码片段和证据边界，不再因为进入下一地点就要求新手凭记忆还原上一幕。
- [x] 回看不会重复增加线索数量，也不会改变当前地点的完成条件；新增前端回归测试覆盖回看动作。

验收：用户在当前地点或复盘时能重新打开已经收录的证据，且“回看”与“新发现”在交互和进度上有明确区别。

### R214：剧情进度可恢复

- [x] 故事地点、已收录线索、本幕复述和判断选择会以未完成快照写入本地学习记录 API；每次探索动作都保存当前状态。
- [x] 重新进入教学桥时会恢复未完成剧情，不会把用户带回序幕；已完成剧情仍按完成步骤进入后续教学，不会被恢复快照拦截。
- [x] 恢复数据经过字段过滤和地点索引边界校验，非法或旧格式数据会回落到安全的序幕状态。

验收：用户在第一幕找到线索后刷新，仍能回到原地点并看到“卷宗已收录 · 点击回看”；完成故事后只记录一次已完成进度。真人试玩仍需观察网络较慢时保存反馈是否足够清楚。

### R215：根地址继续未完成委托

- [x] 根地址启动时会检查当前第一章尝试的教学记录；如果存在已开始的步骤或未完成剧情快照，会直接回到教学桥，不要求用户重新走序幕。
- [x] 新用户和没有学习记录的用户仍然看到序幕；全部教学步骤完成的用户仍进入完成状态，不被“继续学习”分支截走。
- [x] 新增入口回归测试，覆盖未完成剧情快照、现场恢复、已收录线索和名词解释仍可见。

验收：用户关闭或刷新后重新打开根地址，能理解系统正在继续哪一份委托；不把“重新进入应用”误认为“重新开始学习”。

### R216：岗位路线 manifest 实体化

- [x] Java 后端路线从空数组升级为 4 个章节 manifest：分层服务、事务一致性、缓存异步、上线排障。
- [x] 前端工程路线从空数组升级为 4 个章节 manifest：组件状态、请求错误、首屏性能、可访问性交付。
- [x] 每个预览章节都遵守同一套十项学习契约，包含剧情、工作背景、流程、名词、关键代码、证据、Agent、验收、面试和解锁物。
- [x] 路线仍保持“即将解锁”，没有把没有真实沙盒和教学桥的内容伪装成可玩关卡；后续可按 manifest 接入场景和服务端白名单。

验收：岗位选择页能够展示真实的 4 章规划，而不是空白或泛泛的“敬请期待”；AI 主线默认入口和当前学习数据不受影响。

### R217：Java 第 1 关沙盒材料落地

- [x] 新增 `java-layered-request` 固定沙盒，包含 Controller、Service、Repository、DTO、数据库结构和证据文件。
- [x] 新增服务端场景注册、步骤白名单和 `javaLayeredScenario` 教学地图；教学数据解释“谁把什么交给谁”，并用 Controller 越层访问作为可复现故障。
- [x] 沙盒测试只读取固定 Java 文件并生成报告，不编译、不执行 Java、不访问其他项目；初始报告明确失败两项，要求学习者修复后重新运行。
- [ ] 尚未把该关卡标为可进入：还需要把 Java 场景接入路由切换、专属剧情背景和真实浏览器验收，再开放给用户。

验收：材料层和教学契约已通过类型检查；初始沙盒测试能稳定复现“Controller 绕过 Service”的失败。开放前必须补齐路线入口、奖励归属和浏览器路径。

### R218：Java 第 1 关接入教学桥

- [x] Java 路线从“可进入”入口进入独立场景，不再复用 AI 数据消失关卡的标题、流程或剧情。
- [x] 新增五站请求接力剧情：请求城门、Controller 接待厅、Service 规则熔炉、Repository 档案库、面试答辩台。
- [x] 每站包含初学者名词解释、代码/Network/日志/数据库证据、失败路径和面试复述；完整流程明确展示“谁把什么交给谁”。
- [x] Java 场景加入专属镜头契约、伙伴和教学进度恢复步骤 id；刷新后仍能恢复在当前 Java 委托。
- [ ] Java 沙盒尚未完成修复后真实测试报告闭环；前端路线也仍需接入真实沙盒和教学桥。

验收：从首页职业档案选择 Java 后端，进入第 java-1 章教学关卡后，应看到“请求为什么要经过三层”和五站 Java 路线；不得出现“保存成功，但刷新后消失了”等 AI 第一关内容。

### R219：前端第 1 关组件剧场

- [x] 前端工程路线开放第 `frontend-1` 章，不再停留在岗位预告卡。
- [x] 新增 `frontend-component-state` 固定沙盒，覆盖 loading、success、error、`response.ok` 和可访问错误反馈；初始测试稳定复现 2 个红灯。
- [x] 新增组件树、交互记录、浏览器日志和 Agent 交付材料，并把它们接入服务端场景白名单。
- [x] 教学桥新增组件剧场、状态灯控台、Network 回廊、可见反馈舞台，包含状态流、200/503 分岔、名词解释和面试复述。
- [ ] 前端后续 3 章仍需接入真实沙盒；Java 和前端第 1 关都还要完成修复后报告与成长档案结算的浏览器全流程。

验收：从首页职业档案选择前端工程，进入第 `frontend-1` 章教学关卡后，应看到“按钮为什么一点击就乱跳”和四站前端剧情；不得回退到 AI 或 Java 的教学标题。

### R220：岗位路线成长档案归档

- [x] XP 计算、清除章节和伙伴补齐逻辑现在识别 AI、Java、前端三条路线的章节 ID。
- [x] `java-1` / `frontend-1` 使用首关奖励，后续岗位章节使用标准章节奖励；岗位伙伴通关后进入同一收藏档案。
- [x] 增加岗位章节档案回归测试，避免出现“教学能进入但通关后不记账”的断链。

验收：岗位关卡结算后，成长档案应同时记录岗位章节 ID、对应 XP 和伙伴；重新加载档案不能丢失这些记录。

### R221：剧情到实战的用户路径复测

- [x] 浏览器完整走通前端第 1 关：岗位选择 → 专属剧情 → 4 个地点 → 判断 → 主动复述 → 实战前会合 → 前端沙盒 Lab。
- [x] 修正“封存本幕复述”和底部推进按钮同名的问题，推进按钮现在明确区分“继续下一地点”“先保存复述”“先选择判断”。
- [x] 修正前端教学桥错误使用 AI 工作背景的问题。
- [x] 修正 Java/前端实战提交仍按 AI 第 1 章结算的问题，结算章节、XP 和伙伴现在跟随活动路线。
- [ ] 尚未在浏览器中完成用户修复沙盒代码、读取通过报告和最终提交的完整人工闭环；这一步必须保留“应用不执行命令”的安全边界。

验收：进入前端剧情后，工作背景应描述前端状态问题；剧情结束进入 Lab 后，结算不得显示 AI 第 1 章或 AI 伙伴。

## 分层验证门禁

每次改动至少执行对应门禁：

- 静态层：`npm run format:check`、`npm run lint`、`npm run typecheck`。
- 测试层：`npm run test`，涉及主流程时跑 `npm run verify`。
- 用户层：浏览器打开 `http://127.0.0.1:5173/`，检查桌面与 390px 移动端。
- 文案层：扫描主要页面不得出现旧词：`CASE`、`Case`、`基线诊断`、`侦探`。
- 安全层：Web/API 不执行 shell，不读取真实项目，不上传源码。

## 已知边界

### R175：TeachingBridge 按需加载防回退

- [x] `App.tsx` 使用 `React.lazy` 动态导入 `TeachingBridge`，并用暗色章节加载画面承接网络等待。
- [x] Vite 生成生产 manifest；`scripts/verify-lazy-chunks.mjs` 检查教学桥必须是独立动态入口，且不能进入首页静态依赖图。
- [x] `npm run build` 自动执行按需加载门禁，合并时若恢复顶部静态导入会直接失败。
- [x] Node 24 全量门禁通过：9 个测试文件、134 项测试和生产构建。
- [x] 独立浏览器会话验证：首页没有请求 `TeachingBridge.tsx`，进入 `#chapter-13` 后才请求；桌面和 390px 手机均无横向溢出，控制台 0 error。

### R170：十五章冒险等级与伙伴成长循环

- [x] 统一章节 XP 事实源：第 1 章 150 XP，第 2–15 章各 120 XP；重复通关不重复发奖。
- [x] 新增 Lv.1–16 冒险等级和八段阶位，关键晋升分布到第 15 章，不再约第五章就达到最高称号。
- [x] 旧档按真实 `clearedChapterIds` 补齐历史 XP，只补不扣；十五章档案最终为 1830 XP、Lv.16、AI 应用工程师。
- [x] 首页 HUD、归城记录、成长契约和章节结算接入等级星轨；实战通过时展示等级/阶位晋升与伙伴正式归队。
- [x] 结算转场强制回到顶部；1280×720 和 390×844 的实战前会合页均整屏显示主操作，无横向溢出。
- [x] `npm run verify` 通过：9 个测试文件、126 项测试和生产构建；浏览器控制台无错误。
- [ ] 等级与收藏的愉悦度仍需真人连续通关观察，自动化不能证明奖励节奏真的有趣。

### R169：十五章专属运镜与教学地图

- [x] 用 `src/chapterCinematics.ts` 为 15 章定义独立镜头序列、背景焦点、地图名称、地图说明和唯一拓扑。
- [x] 剧情序章与地点切换按章节/地点改变俯视、肩后、近景、推轨、锁定等景别，并保留减弱动效模式。
- [x] 项目地图从通用两列卡片改为十二列空间布局，直接读取真实 `projectMap.edges` 绘制分支、回环和汇合。
- [x] 手机端将空间图回落为可读单列；产品取舍、RAG 迷宫、交付审查三图在 390px 均无横向溢出。
- [x] 第 13 章修正为真实审查菱形：交付说明同时进入 Diff/测试，两路汇合后检查边界、文档和接收决定。
- [x] `npm run verify` 通过：9 个测试文件、123 项测试、生产构建完成；浏览器控制台无错误。
- [ ] 仍需真人连续试玩 3 章，验证不同地图是否帮助理解，而不是仅有视觉差异。

- 当前主线 1-1、主线 1-2、主线 1-3、主线 1-4、主线 1-5、主线 1-6、主线 1-7、主线 1-8、主线 1-9、主线 1-10、主线 1-11、主线 1-12 和主线 1-13 已接入完整 UI 实战闭环沙盒。
- 主线 1-2 已有 `sandbox/canvasstorm-product-brief` 种子沙盒和服务端白名单材料，覆盖 Brief、方向筛选、候选取舍和会话保存；Lab 已显示本章步骤、提示、材料导览、沙盒目录和产品链路复盘。
- 主线 1-3 已有 `sandbox/identity-session-corridor` 种子沙盒和服务端白名单材料，覆盖登录响应、Cookie/Token 保存、401 Network 和刷新恢复；Lab 已显示本章身份路线、凭证存放、401 反证、材料导览、沙盒目录和登录态面试复盘。
- 主线 1-4 已有 `sandbox/api-error-court` 种子沙盒和服务端白名单材料，覆盖请求体、状态码、结构化错误和后端日志；Lab 已显示本章请求体检查、状态码判定、错误结构、日志串证、材料导览、沙盒目录和接口排障复盘。
- 主线 1-5 已有 `sandbox/data-consistency-forge` 种子沙盒和服务端白名单材料，覆盖重复提交、Idempotency-Key、唯一约束、事务边界和数据库数量证据；Lab 已显示本章连点现场、幂等键、数据库数量、材料导览、沙盒目录和数据一致性面试复盘。
- 主线 1-6 已有 `sandbox/performance-fog-lab` 种子沙盒和服务端白名单材料，覆盖 Network 瀑布图、Server-Timing、渲染画像、缓存复测和性能测试证据；Lab 已显示本章瀑布图阅读、后端计时、渲染画像、材料导览、沙盒目录和性能瓶颈面试复盘。
- 主线 1-7 已有 `sandbox/ai-api-key-vault` 种子沙盒和服务端白名单材料，覆盖前端密钥扫描、服务端环境变量、流式响应、上游失败兜底和 Agent 交付证据；Lab 已显示本章密钥泄露、服务端 key、流式响应、失败兜底、材料导览、沙盒目录和 AI API 安全面试复盘。
- 主线 1-8 已有 `sandbox/hallucination-mirror-hall` 种子沙盒和服务端白名单材料，覆盖 Prompt 约束、上下文资料、编造引用、无资料硬答、引用校验和 Agent 交付证据；Lab 已显示本章 Prompt 合约、上下文资料、编造引用、无资料拒答、材料导览、沙盒目录和幻觉控制面试复盘。
- 主线 1-9 已有 `sandbox/rag-knowledge-maze` 种子沙盒和服务端白名单材料，覆盖 chunk 索引、来源路径、topK 命中错误、回答引用缺失、无关问题拒答和 Agent 交付证据；Lab 已显示本章 chunk 来源、检索错配、matches/citations、材料导览、沙盒目录和 RAG 面试复盘。
- 主线 1-10 已有 `sandbox/agent-tool-tower` 种子沙盒和服务端白名单材料，覆盖工具注册表、参数 schema、越权调用、失败回退、审计日志和 Agent 交付证据；Lab 已显示本章工具注册表、参数 schema、权限门禁、失败回退、审计日志、材料导览、沙盒目录和 Agent 工具面试复盘。
- 主线 1-11 已有 `sandbox/verification-trial-arena` 种子沙盒和服务端白名单材料，覆盖失败复现、单测、集成测试、手动复测、过期报告和回归风险；Lab 已显示本章失败复现、单元边界、集成流程、手动复测、过期报告、材料导览、沙盒目录和可信验收面试复盘。
- 主线 1-12 已有 `sandbox/agent-brief-forge` 种子沙盒和服务端白名单材料，覆盖空泛委托、越界委托、清晰委托、验收命令、浏览器路径、风险回滚和 Agent 交付格式；Lab 已显示本章空泛委托、可观察目标、安全边界、验收路径、风险回滚、交付格式、材料导览、沙盒目录和 Agent 委托面试复盘。
- 主线 1-13 已有 `sandbox/delivery-review-court` 种子沙盒和服务端白名单材料，覆盖交付说明、Diff 范围、过期测试证据、移动端验收缺口、文档同步缺口和拒收决定；Lab 已显示本章交付说明核对、Diff 范围、过期测试、移动端缺口、文档同步、拒收决定、材料导览、沙盒目录和 Agent 交付审查面试复盘。
- 主线 1-14 已有 `sandbox/release-readiness-gate` 种子沙盒和服务端白名单材料，覆盖上线计划、生产环境变量、备份恢复、移动端冒烟、监控信号和回滚方案；Lab 已显示本章上线计划、生产配置、备份恢复、桌面/390px 冒烟、监控信号、回滚退路、Agent 补证任务和上线面试复盘。
- 主线 1-15 已有 `sandbox/interview-answer-forge` 种子沙盒和服务端白名单材料，覆盖项目素材库、STAR 草稿、故障复盘、技术取舍、追问演练和答辩 Rubric；Lab 已显示本章项目素材库、STAR 草稿、故障复盘、技术取舍、追问演练、答辩 Rubric、Agent 面试官、沙盒目录和终章面试复盘。
- 伙伴/宠物/装备解锁已记录在成长档案，并能在首页伙伴背包中浏览、筛选和查看对应复盘素材；首页已有面试复盘册、可填写复盘房间、作品集 Markdown 出口和本地备份库，复盘草稿保存到本地 SQLite 学习记录。
- 首页已展示 AI 应用开发 15 章路线，事实源是 `src/careerRoadmap.ts`。
- 已有 Java/前端等多岗位 manifest 骨架和首页路线选择；Java/前端路线仍是“即将解锁”，尚未接入具体章节。
- 学习效果尚未真人验收。
- 底层 API 仍沿用 `baseline-plan` 这个历史步骤 id；它不是用户可见概念。

## R222：岗位卷宗数据源统一

- 修正 Java/前端岗位路线选中章节仍回退到 AI 章节对象的问题。
- 章节结算、工作背景和交接材料现在按当前岗位路线与章节编号读取，避免学习 Java 时出现 AI 章节标题或固定记成第 1 关。
- 验证：`npm run typecheck`、`src/App.test.tsx` 与 `src/careerRoadmap.test.ts` 通过。

## R223：前端第 2 关请求状态纵向切片

- 新增 `frontend-request-states` 场景与独立沙盒 `sandbox/frontend-request-states/`。
- 主题是提交状态机：`idle → loading → success/error`，覆盖 201、503、超时、重复提交、`aria-live` 和 Agent 交付审查。
- 接入岗位路线第 2 章的剧情入口、不同场景背景、故事地点、教学代码导读、证据材料和实战配置。
- 待补：Java 第 2 关同等纵向切片，以及前端第 3、4 关。

## R224：Java 第 2 关事务熔炉纵向切片

- 新增 `java-transaction-consistency` 场景和独立沙盒。
- 加入 `OrderService.java` / `OrderRepository.java` 关键代码，围绕订单、库存、幂等键、唯一约束和回滚讲解半成功事故。
- 接入 Java 岗位第 2 关的入口、实战配置、事务场景背景、宠物「事务小锻炉」和结算路线。
- 待补：Java 第 3、4 关，前端第 3、4 关，完成全路线浏览器验收。

## R225：Java 第 3 关缓存观测纵向切片

- 新增 `java-cache-observability` 场景和独立沙盒。
- 加入 `ProjectCacheService.java` 关键代码，围绕缓存命中、TTL、数据库版本、异步刷新和降级讲解旧数据排查。
- 接入 Java 岗位第 3 关入口、缓存风廊剧情、缓存巡航员伙伴和时间线验收材料。
- 待补：Java 第 4 关，前端第 3、4 关，完整浏览器验收。

## R226：前端第 3 关首屏观测纵向切片

- 新增 `frontend-performance-proof` 场景和独立沙盒。
- 围绕 Network 瀑布图、TTFB、React 渲染画像、缓存复测和移动端验收，训练区分资源/接口/渲染瓶颈。
- 接入前端岗位第 3 关入口、首屏观测塔剧情、首屏观测师伙伴和性能实战配置。
- 待补：Java 第 4 关、前端第 4 关，以及全路线最终浏览器验收。

## R227：Java 第 4 关上线港纵向切片

- 新增 `java-release-harbor` 场景和独立沙盒。
- 加入 `ReleaseGate.java`，围绕密钥、备份恢复、健康检查、监控和回滚条件训练可控上线。
- Java 岗位路线现在已经从分层、事务、缓存走到上线门禁，四关均有独立入口与结算数据源。
- 待补：前端第 4 关，以及 Java/前端路线的最终浏览器全流程验收。

## R228：前端第 4 关无障碍交付纵向切片

- 新增 `frontend-accessibility-proof` 场景和独立沙盒。
- 围绕语义结构、键盘操作、焦点可见性、移动端布局和回归证据，训练把“看起来能用”变成可验证交付。
- 前端岗位路线现在已经从组件、请求、性能走到无障碍与交付审查，四关均有独立入口与结算数据源。
- 待补：Java/前端路线的最终浏览器全流程验收。

## R229：前端第 5 关测试回归纵向切片

- 新增 `frontend-testing-proof` 场景和独立沙盒。
- 围绕失败复现、单元/集成边界、浏览器手动复测、源码指纹和回归风险，训练判断“测试通过”是否真的对应当前前端交付。
- 前端岗位路线扩展为五关，新增「回归审查官」伙伴和可转成面试复盘的交付审查证据。
- 沙盒初始测试保持红灯，必须由用户手动修复并运行测试；应用不会替用户执行命令。

## R230：跨岗位图鉴与章节显示修正

- 伙伴图鉴按当前职业路线显示，Java/前端新增伙伴可以独立收集。
- Java/前端界面使用数字章节，隐藏 `java-1`、`frontend-1` 等内部 ID；路线进度按当前路线计算。
- 浏览器验收：前端路线显示 5 章、出现「回归试炼场」、初始收集进度为 `0/5`。

## R231：Java 第 5 关线上事故闭环

- 新增 `java-production-incident` 场景和 `sandbox/java-production-incident/`。
- 用事故回声塔串起监控报警、请求时间线、结构化日志、影响判断、止血/回滚、恢复复测和面试复述。
- 新增 `IncidentTimeline.java` 关键代码导读、事故回声官伙伴、性能观测背景和线上故障复盘 Lab。
- Java 路线扩展为 5 章，入口、章节卷宗、TeachingBridge、结算与伙伴图鉴均已按当前路线接通。
- 验证：Node `v24.13.1` 下 `npm run verify:quick`，155 个测试通过；浏览器和生产构建待本轮完成。

## R232：Java 第 5 关独立场景与浏览器验收

- TeachingBridge 为事故回声塔单独提供六个地点：报警塔、时间线档案、结构化日志回廊、止血决策门、回滚室和复盘厅。
- 六个地点分别绑定不同角色、背景、对白和证据解释，避免第 5 关继续复用第 4 关上线港的旧场景。
- 浏览器验收确认 Java 路线显示 5 章，点击第 5 关后能看到「报警、止血与回滚复盘」和「事故回声塔」。
- 验证：`npm run verify` 通过；Node `v24.13.1` 下 9 个测试文件、155 个测试通过并完成生产构建。

## R233：剧情转场角色登场卡

- 转场卡加入下一地点角色立绘、地点、调查目标、对白和待接证据，让角色随着剧情登场而不是只替换背景。
- 预告标题改为非章节标题语义，避免动画还在播放时被读成已经进入下一幕。
- 验证：AI 第 2 章和第一章转场回归通过，9 个测试文件、155 个测试通过。
- 回归额外确认下一幕角色 `传送门守卫` 和调查目标会在转场卡中出现。

## R234：本章地点航线

- 在剧情舞台顶部固定显示本章地点航线：已到达地点、当前调查地点、下一地点和对应角色。
- 桌面端用紧凑横向航线，移动端使用可横向浏览的地点条；地点名使用短地标，完整名称保留在提示中。
- 验证：第一章路径回归通过；155 个测试、生产构建和懒加载检查通过。

## R235：岗位路线独立剧情补齐

- Java 缓存观测改为独立五幕：缓存命中、缓存 key、旧数据失效、缓存降级和命中率/正确性复测。
- 前端无障碍交付改为独立五幕：可感知信息、键盘路径、语义结构、异步状态反馈和人工/自动化验收。
- 每幕继续遵守统一教学契约：剧情背景、完整交接、名词解释、关键代码、证据任务、Agent 委托、验收动作和面试复盘。
- 验证：Node `v24.13.1` 下 `npm run verify` 通过：格式、Lint、TypeScript、9 个测试文件 / 155 个测试、生产构建和 TeachingBridge 懒加载检查全部通过。浏览器已确认 Java 路线档案显示缓存风廊与缓存巡航员；教学舞台仍需独立空白数据空间验收。

## R236：新用户序章与独立空白空间验收

- 在隔离 SQLite 数据库中从新用户入口进入「代码城失忆夜」，选择「调取现场证据」后进入第 1 章「数据为什么消失」。
- 浏览器确认序章会先解释调试师身份、证据优先级和选择结果，再展示委托、玩家目标、完整交接流程入口、工作锦囊和进入主线按钮。
- 验证：`npm run verify` 通过；隔离端口 `5174` + 临时数据库浏览器验收通过，未污染正式本地学习记录。

## R237：路线入口与最终门禁复核

- 后续章节可以查看完整卷宗、剧情舞台、流程交接、名词和验收目标；只有当前章节进入实战，保持新手学习顺序可信。
- 浏览器确认 Java 后端入口可进入第 1 章「请求为什么要经过三层」，并显示 Controller → Service → Repository → 数据库 → HTTP 响应完整链路。
- 验证：Node `v24.13.1` 下 `npm run verify` 通过：格式、Lint、TypeScript、9 个测试文件 / 155 个测试、生产构建和 TeachingBridge 懒加载检查全部通过。
- 环境备注：系统默认 Node 不支持 `node:sqlite`，验证时使用项目指定 Node 24；不是代码回归。

## R238：当前委托入口语义修正

- 任务板按钮从“进入主线”改为“进入当前委托”，避免用户选择第 3 章卷宗后误以为通用按钮会进入第 3 章。
- 选中章节的进入动作只在对应卷宗下显示，并明确写出“进入第 X 章教学关卡”。
- 验证：Node `v24.13.1` 下 `npm run verify` 通过，9 个测试文件 / 155 个测试、生产构建和懒加载检查通过。

## R239：岗位章节契约防复用门禁

- 路线测试现在检查 Java/前端每章的九件套数组非空、流程交接数量、世界场景唯一和剧情场景唯一，防止新增章节变成只换标题的空壳。
- 验证：Node `v24.13.1` 下 `npm run verify` 通过，9 个测试文件 / 155 个测试、生产构建和懒加载检查通过。

## R240：路线卷宗的场景与角色去复用

- Java 第 5 关卷宗改用信号风暴调度塔，前端第 1/5 关改用记忆回声画廊与交付审查厅，路线卡片的背景跟随本关主题变化。
- Java 第 2/3 关与前端第 3/5 关改用专属角色立绘，避免宠物头像承担主引导角色或审查官立绘重复；宠物仍作为伙伴展示。
- 验收结果：Node `v24.13.1` 下 `npm run verify` 通过，9 个测试文件 / 155 个测试、生产构建和 TeachingBridge 懒加载检查通过；浏览器确认 Java 后端与前端工程均显示 5 章独立路线，当前委托按钮语义明确，不会误导用户跳回错误章节。
- 环境边界：当前 in-app browser 后端不提供强制视口切换能力，移动端全路线逐屏验收未在本轮冒充完成。

## R241：390px 新用户主流程与教学桥验收

- 在临时 API/SQLite 空间中，用真实浏览器 `390×844` 从代码城序章走到第一章 TeachingBridge，确认序章选择、领取委托、岗位目录和教学舞台连续可用。
- 教学舞台在窄屏保持 `scrollWidth = clientWidth = 390`，且同时展示上一幕回声、本幕任务契约、完整流程卷轴、当前交接、名词小抄和探索线索；TeachingBridge 资源按需加载成功。
- 验收结论：本轮桌面与 390px 主流程证据齐全；正式学习记录未被临时验收污染。真人学习效果不以自动化浏览器结果代替。

## R242：移动端地点航线改为两列全览

- 手机端本章地点航线从横向滑轨改为两列网格，当前地点、下一站角色和全部后续地点可在同一块区域看到。
- 验收结果：真实 `390×844` 浏览器截图显示 4 个地点为 `2×2`，页面没有横向溢出；桌面端布局不变。

## R243：剧情选择回声接力

- 场景判断选择会持久化到 `sceneDecisions`，并在下一幕显示「上一幕判断回声」。
- 选择“继续追证据”会把上一幕的证据交接和下一幕的核对重点写进剧情；选择先相信表面结果不会扣分，但会明确留下“还不能单独证明完成”的提醒。
- 验收结果：定向测试、完整门禁和真实 390px 浏览器路径均通过。

## R244：场景判断选项绑定当前线索

- 每幕判断选项绑定当前幕第一条探索线索，避免所有地点重复同一句选择文案。
- 验收结果：玩家能从按钮文字看出自己正在判断哪份证据，继续追踪选项仍明确指向下一站；完整门禁通过。

## R245：第一章角色接力补齐

- 第一章档案库深处改用知识馆守卷人立绘，修复台改用委托书锻造师立绘，避免四幕剧情后半段重复同一角色。
- 验收结果：每个地点的角色立绘与地点职责相符，角色会随着调查推进而接力出现；完整门禁通过。

## R246：伙伴图鉴未解锁轮廓提亮

- 未解锁角色继续保持灰阶和神秘感，但不再因为过度暗化变成纯黑块。
- 验收目标：用户能识别有角色等待解锁，同时不会提前看到完整立绘细节。

## R247：序章向导人物接力

- 序章警报和调查选择使用同一位档案馆记录员立绘，避免玩家在关键选择处失去剧情人物的连续感。
- 移动端选择场景收紧留白与角色尺寸，验收目标是 `390×844` 下三个行动选项完整可见且无横向溢出。

## R248：代码材料先看关键行

- 材料阅读页默认只显示导览原文或语义关键词命中的关键行和上下文，不再让新手一进入就面对整段源码。
- 用户可以主动展开完整卷宗；切换材料会回到关键行模式，避免上一份材料的阅读状态误导当前证据。
- 验收目标：默认知道第一眼看哪里，展开后仍能核对完整上下文；测试与真实 `390×844` 浏览器路径通过。

## R249：移动端实战任务前置

- 手机实战页优先显示当前要完成的响应、基线或测试验收动作，完整流程地图和案件路线放到后面作为回看资料。
- 冒险日志在手机端把当前任务置顶，已收录与下一步保留为紧凑记忆卡。
- 验收目标：用户打开实战页就能知道现在要做什么，不必先滚过多块说明；`390×844` 无横向溢出。

## R250：实战验收目标前置

- 验收页先显示「本次验收目标」，解释要证明修复能被测试复现并通过，以及通过后会解锁下一棒、写入成长档案。
- 失败结果继续作为调查线索展示；手动测试安全边界和「应用只读取报告」保持不变，按钮改为「读取结果」。
- 验收目标：真实 `1280×900` 与 `390×844` 浏览器均能看到目标卡和读取结果入口，页面无横向溢出；完整门禁通过。

## R251：三条岗位路线入口审计与文案收口

- 真实浏览器逐一检查 AI 应用开发、Java 后端和前端工程入口；AI 显示 15 章，Java/前端各显示 5 章，当前委托、世界地图、第一关剧情角色和背景均跟随岗位路线。
- 修正 Java/前端章节验收目标的重复句号，避免岗位路线进入后出现明显的文案断层。
- 验收目标：三条路线入口不回退到 AI 第一关，路线章节数量与岗位档案一致；完整门禁通过。真人沙盒修复与结算仍单独记录，不以路线入口展示代替。

## R252：岗位关卡场景独立契约

- 前端第 1 至 5 关和 Java 第 1 至 5 关的实战背景按关卡职责区分，不再让岗位关卡复用默认 AI 场景；前端第 2 关传送厅、前端第 4 关交付审查庭、Java 第 5 关信号风暴调度塔已收口。
- 新增实战场景契约测试：每条岗位路线的 `scenarioId`、背景图和沙盒路径必须完整且不重复。
- 验收目标：场景变化不仅发生在标题，用户进入实战时地点、背景和学习任务一致；完整门禁通过。

## R253：通过报告证据回显

- 实战验收通过后显示通过数量、通过测试名称和证据解释；失败时继续显示流程断点、先查材料和下一步，不让红绿状态成为孤立结论。
- 验收目标：用户能回答“哪些测试证明了什么”，并把这份报告带入后续 Agent 交付和面试复盘；完整门禁通过。

## R254：作答检查从标签变成有内容

- Agent 委托的背景、边界、验收检查必须有标签后的实际内容；普通证据题要求证据、含义和下一步验证动作同时出现。
- 验收目标：空骨架不能被误报为完整答案，同时不把这个轻量检查宣传成语义理解或能力认证；完整门禁通过。

## R255：教学舞台前置本关交付契约

- [x] 在导师同行卡中显示当前证据要证明的结果、交给下一棒的证据来源和本关最终产出。
- [x] 交付契约直接读取当前项目地图节点，避免出现标题与流程内容脱节。
- [x] 详细的流程回放、Agent 委托、验收动作和面试产出继续留在可展开辅助区，移动端保持任务优先。
- [ ] 用真实浏览器检查桌面与 `390×844` 的契约可读性和无横向溢出。

验收目标：用户进入任何一关后，不展开辅助资料也能回答“现在证明什么、证据交给谁、学完留下什么”。

## R256：岗位剧情角色与场景拆分

- [x] Java 事务关使用岗位专属的订单锻造台、幂等门廊、唯一索引审查庭、事务回滚试炼场和订单答辩厅。
- [x] 前端性能关使用岗位专属的首屏计时港、浏览器瀑布观测台、接口时钟塔、渲染舞台审查席和性能回归试炼场。
- [x] 两条路线均配置随剧情接力的角色立绘，并增加 `portraitOverride` 防止旧场景角色映射覆盖新角色。
- [x] 测试锁定岗位专属地点、角色和立绘资源，避免后续新增关卡只换标题不换剧情。

验收目标：用户切换岗位或章节时，看到的是与任务职责一致的地点、角色和对白，而不是同一套故事换名字。

## R257：全路线剧情背景唯一契约

- [x] 审计 AI 15 章、Java 5 章和前端 5 章的 TeachingBridge 剧情场景集合。
- [x] 清理同章重复背景：每个剧情地点都有独立背景，地点切换不再停留在上一幕画面。
- [x] Java 上线关和前端测试关使用岗位专属角色、地点和对白，不复用 AI 主线剧情数组。
- [x] 新增统一剧情注册表和测试，锁定 25 个场景集合的同章背景唯一性。

验收目标：用户沿剧情进入下一地点时，看到新的地标、角色或镜头语境，并能把它与当前工作问题对应起来。

## R258：空白用户第一章证据接力验收

- [x] 用隔离 API、临时 SQLite 和独立浏览器 origin 从序章走到第一章。
- [x] 真实走通前端舞台两条线索、主动复述、判断选择和传送门大厅下一地点。
- [x] 浏览器明确展示“谁把什么交给谁”、`response.ok` 的含义和 201 的证据边界。
- [x] 390×844 无横向溢出，正式学习记录未被污染。
- [ ] 继续走完档案库、修复台、第一章实战修复与报告回读。

验收目标：新用户不需要预先懂代码，也能从“灯亮了”逐步理解请求、回执、数据库证据和下一步调查。

## R259：第一章从剧情到实战入口验收

- [x] 真实走完第一章四个地点、每幕两条线索、判断选择和主动复述。
- [x] 第三幕明确解释临时内存与数据库 SELECT 0 行的因果关系。
- [x] 第四幕明确解释 INSERT、刷新和 SELECT 的验收路线，并进入实战会合。
- [x] 实战页显示当前任务、流程交接、关键行材料阅读和安全边界。
- [ ] 用户手动完成沙盒修复、运行测试并读取通过/失败报告。

验收目标：剧情学习不会假装等于掌握；用户能把故事里的判断带进真实材料、手动修复和可复核测试。

## R260：测试报告闭环边界验收

- [x] 在隔离副本真实运行首关沙盒测试，确认故障版本会生成固定 `test-results.json`。
- [x] 服务端保持只读报告，不执行用户命令；失败报告继续翻译为下一处调查线索。
- [x] 补充“尚未生成报告”和“损坏 JSON”边界测试，防止状态误报。
- [ ] 用户修复真实沙盒后手动运行测试，并回到应用读取通过报告。
- [ ] 通过报告后完成结案、成长档案和后续复测的真实浏览器验收。

验收目标：用户明确知道“应用只读测试结果”，也明确知道失败、等待和通过各自代表什么；只有真实通过报告才能进入结案。自动化边界测试与完整门禁已通过。

## R261：全路线实战九件套契约

- [x] 为 AI 15 章、Java 5 章和前端 5 章建立统一配置契约测试。
- [x] 锁定每关独立场景、流程链、基线、固定沙盒、必填作答、验收步骤、材料导览、能力记录和面试/迁移提示。
- [x] 锁定传入错误或旧场景 ID 时不能静默回退到第一章的路线事实。
- [ ] 继续完成全路线逐章浏览器视觉抽检和真人迁移效果验收。

验收目标：每个可进入的岗位关卡都是真正可学习、可实战、可复盘的一关，不会出现“地图有名字、实战内容却复用第一关”的断层。25 个配置的自动化契约已通过。

## R262：首章实战结案边界复核

- [x] 正式浏览器从首章教学结算进入实战，确认结案页能显示真实测试证明、学习过程记录和迁移能力待证明项。
- [x] 结案页保留工作复盘、Agent 委托、面试讲法和提示等级，剧情完成不会直接冒充能力掌握。
- [ ] 空白用户手动修复首关沙盒、运行测试并读取通过报告。
- [ ] 三条路线逐章浏览器视觉抽检和真人迁移效果验收。

验收目标：首章结束时用户知道哪些事实已经被测试证明，哪些只是学习记录，下一步还要在哪里继续证明。

## R263：混合岗位章节进度排序稳定性

- [x] 修复成长档案对数字 AI 章节和 `java-*`、`frontend-*` 岗位章节混排时的 `NaN` 排序问题。
- [x] 增加混合章节 ID 回归测试，确保伙伴收集和路线进度记录顺序稳定。

验收目标：用户切换岗位学习后，成长档案仍能稳定记录章节和伙伴，不因章节 ID 格式不同而出现顺序漂移。

## R264：三条岗位路线入口浏览器复核

- [x] 在隔离环境从空白用户走通序章、领取委托和岗位路线选择。
- [x] 确认 AI 应用开发显示 15 章，首章为「数据断层」并绑定档案馆记录员。
- [x] 确认 Java 后端显示 5 章，首章为「分层服务塔」并绑定分层守望者。
- [x] 确认前端工程显示 5 章，首章为「组件剧场」并绑定状态编舞师。
- [x] 确认三条路线的目标流程、任务产出和地图内容随路线变化，没有静默回退到 AI 第一关。
- [ ] 继续逐章浏览器视觉抽检，并完成真人沙盒修复、报告回读和跨项目迁移复测。

验收目标：用户选择岗位后，第一眼就能知道这条路线要解决什么工作问题、沿哪条流程学习，以及这一岗位有多少章；三条路线入口不能串剧情。

## R265：TeachingBridge 按需加载过渡页

- [x] 保持 TeachingBridge 使用 `React.lazy` 独立加载，不把教学大模块重新塞回首屏入口。
- [x] 加入路线一致的剧情加载页，显示当前委托、关卡、地点、学习流程和本关背景图。
- [x] 用“剧情现场 → 关键代码 → 证据验收”给用户一个可理解的等待原因，避免切换时只看到抽象 loading 文案。
- [x] 通过格式、Lint、类型、164 条测试、生产构建和懒加载 chunk 检查。
- [ ] 继续逐章浏览器视觉抽检，并完成真人沙盒修复、报告回读和跨项目迁移复测。

验收目标：进入任意岗位关卡时，即使教学模块仍在加载，用户也能知道自己正在去哪里、要解决什么工作问题，以及接下来会经过哪三步；加载页不能与正式剧情界面风格断层。

## R266：全量门禁与首关浏览器验收

- [x] 用 Node `v24.13.1` 重跑 `npm run verify`，格式、Lint、类型、9 个测试文件 / 164 个测试、生产构建和懒加载 chunk 检查全部通过。
- [x] 隔离浏览器从空白用户走通序章、领取委托、第 1 章主线和前端舞台，确认角色、委托、交接链和探索线索在首屏可理解。
- [x] 关闭本轮临时 API、SQLite 和 Vite 服务，避免验收环境遗留后台进程。
- [x] 增加根目录 `.nvmrc` 固定 Node `v24.13.1`，并在交接记录里说明 Node 版本前置条件。
- [ ] 继续逐章视觉抽检，并完成真人沙盒修复、报告回读和跨项目迁移复测。

验收目标：验证证据必须能复现，环境问题不能伪装成代码失败；首关入口要能让新用户知道“我是谁、要解决什么、下一步找谁”。

## R267：章节角色变化内容门

- [x] 审计 25 条 AI、Java、前端路线关卡的地点、背景、角色、对白、导师解释和线索内容。
- [x] 修复第 8 章和第 10–15 章多个地点复用同一角色的问题，补齐不同角色身份与立绘。
- [x] 新增只读场景查询和内容契约测试，防止后续新增章节只换标题/背景、不换剧情角色和教学内容。
- [ ] 用浏览器逐章确认角色登场、背景切换和移动端布局；继续完成真人沙盒闭环。

验收目标：场景变化必须同时带来新的地点、角色和学习视角，而不是只换一张背景图。

## R268：路线大厅串线修复

- [x] 隔离环境从空白用户走到序章、证据优先选择和路线大厅，抽检 AI、Java 后端、前端工程入口。
- [x] 修复“知识馆守卷人”仍引用旧 SVG 立绘的问题，运行时改用统一 WebP 角色图。
- [x] 修复 Java/前端路线的后续主线折叠区固定读取 AI 15 章的问题，改为读取当前 `selectedRoute.chapters`。
- [x] 修复当前委托说明固定写“全部 15 章”的问题，改为按当前路线章节数显示。
- [x] 桌面浏览器确认 Java 路线显示“第 2 至 5 章”，且折叠区不再包含 AI 第 15 章。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过，9 个测试文件 / 166 个测试、生产构建和 `TeachingBridge` 懒加载检查全部通过。
- [x] 补跑本轮修复后的 `390×844` 移动端正式浏览器证据：AI、Java、前端路线均无横向溢出，Java/前端均显示第 2 至 5 章且不包含 AI 第 15 章。
- [x] 新增 App 回归测试锁定 Java/前端路线不会串回 AI 十五章；后续扩展到 Java 第 2–5 章、前端第 2–5 章卷宗选择，避免只首章正确、后续节点又串线。
- [x] `npm run verify:quick` 通过 9 个测试文件 / 166 个测试。

验收目标：岗位路线不能串剧情、串章节数或混用旧风格角色图；用户选择 Java/前端时只看到对应岗位的 5 章成长地图。

## R269：旧资源断层防回退门禁

- [x] 新增资源契约测试，读取运行时入口文件，防止旧风格角色/宠物 SVG 和旧 PNG 场景重新被导入。
- [x] 校准测试桩与交接文档中的旧 PNG 引用，避免后续合并时把旧资源路径误认为仍在使用。
- [x] 扫描 `HANDOFF.md`、`docs/`、`changelogs/` 和 `src/`，确认旧角色 PNG 与旧剧情场景 PNG 路径没有残留匹配。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：9 个测试文件 / 167 个测试。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、9 个测试文件 / 167 个测试、生产构建和 `TeachingBridge` 懒加载检查。
- [ ] 继续逐章浏览器视觉抽检、真实沙盒修复与报告回读、跨项目迁移复测和合并审查。

验收目标：后续合并或继续开发时，不能把已经淘汰的旧风格角色、宠物和 PNG 场景重新带回运行时，避免用户再次看到风格断层。

## R270：正式复访路线浏览器抽检

- [x] 在正式 `http://127.0.0.1:5173/` 认领当前浏览器标签，确认当前用户为 `Lv.16 · AI 应用工程师`、`15/15`，入口是终章归城而不是新用户序章。
- [x] 打开职业档案，确认桌面 `1280px` 下 `scrollWidth === clientWidth`，页面背景为暗色，抽检没有白色后台断层。
- [x] 切换 Java 后端路线，确认显示 5 章、首章「分层服务塔」、后续「第 2 至 5 章」，没有「第 2 至 15 章」或「面试议会」串入。
- [x] 切换前端工程路线，确认显示 5 章、首章「组件剧场」、后续「第 2 至 5 章」，没有「第 2 至 15 章」或「面试议会」串入。
- [x] 浏览器控制台 error 为 0；本轮未重置用户学习记录，也未创建新的验收数据空间。
- [ ] 继续移动端全路线视觉抽检、三条路线逐章浏览器回归、真实沙盒修复与报告回读、跨项目迁移复测和合并审查。

验收目标：已经通关的用户再次打开项目时，能看到统一的暗色 RPG 复访入口；切换到 Java/前端路线时不再看到 AI 十五章内容串线。

## R271：390px 新用户路线大厅移动抽检

- [x] 使用独立 Playwright CLI 会话 `codequest-mobile-r271`，设置 `390×844` 视口打开正式 `http://127.0.0.1:5173/`，从空白会话进入 `Lv.1 · 见习开发者` 序章。
- [x] 390px 序章首屏显示「代码城失去了记忆」和「走进档案馆」，暗色背景，`scrollWidth = 390`。
- [x] 390px 从「走进档案馆」到「调取现场证据」再到「领取委托」连续可用，选择反馈可见，`scrollWidth = 390`。
- [x] 领取委托后进入 AI 路线大厅，能看到当前委托、角色、工作背景、完整交接链、成长契约和 15 章路线；抽检无白色后台断层。
- [x] 切换 Java 后端路线，确认 5 章、首章「分层服务塔」、后续「第 2 至 5 章」，没有「第 2 至 15 章」或「面试议会」串入。
- [x] 切换前端工程路线，确认 5 章、首章「组件剧场」、后续「第 2 至 5 章」，没有「第 2 至 15 章」或「面试议会」串入。
- [x] Playwright 控制台 Errors 0 / Warnings 0；独立移动验收浏览器已关闭。
- [ ] 继续 25 个关卡逐章移动端视觉回归、真实沙盒修复与报告回读、跨项目迁移复测和合并审查。

验收目标：新用户在手机尺寸打开时，能从序章进入路线大厅并理解自己是谁、为什么去第一章、路线怎么走；岗位切换不能造成横向滚动、白色断层或 AI 十五章串线。

## R272：AI 15 章教学入口桌面/移动批量回归

- [x] 使用隔离 API `CODE_QUEST_PORT=4331`、临时 SQLite `/tmp/code-quest-r272.sqlite` 和独立 Vite `http://127.0.0.1:5181/` 验收，未触碰正式 `5173` 用户数据。
- [x] 识别并规避同一 SPA 页面只改 hash 不重新挂载的验收陷阱，改用 `?audit=<chapter>#chapter-<chapter>` 强制整页加载每章教学入口。
- [x] AI 第 1-15 章桌面 `1200×760` 批量抽检全部通过：每章可直达教学序章、点击「开始闯关」、看到剧情角色、本章地点航线、任务契约、流程/术语线索和 WebP 角色图。
- [x] AI 第 1-15 章桌面抽检均为暗色背景、无白色后台断层、`scrollWidth === clientWidth`，未发现旧 PNG 场景图。
- [x] AI 第 1-15 章移动 `390×844` 批量抽检全部通过：15/15 `scrollWidth = 390`，每章都有剧情角色、地点航线、任务契约、流程/术语线索和 WebP 角色图。
- [x] Java 后端第 1 章「分层服务塔」桌面/390px 通过：从新用户序章进入路线大厅、选择 Java 后端、进入第 1 章主线、点击「开始闯关」后，显示分层塔守门人、请求城门和分层请求航线。
- [x] 前端工程第 1 章「组件剧场」桌面/390px 通过：从新用户序章进入路线大厅、选择前端工程、进入第 1 章主线、点击「开始闯关」后，显示状态编舞师、组件剧场入口和前端状态航线。
- [x] Playwright 控制台 Errors 0 / Warnings 0；独立浏览器已关闭，临时 `5181`/`4331` 服务已停止。
- [ ] 继续 Java/前端第 2-5 章教学入口逐章浏览器回归、真实沙盒修复与报告回读、跨项目迁移复测和合并审查。

验收目标：AI 主线 15 章不只是配置存在，而是在真实浏览器里都能进入剧情教学，并在桌面与手机尺寸保持统一 RPG 风格、角色/地点/流程可见、无横向溢出。

## R273：Java/前端第 2-5 章岗位深链与教学入口回归

- [x] 新增岗位章节深链：`#chapter-java-2` 至 `#chapter-java-5`、`#chapter-frontend-2` 至 `#chapter-frontend-5`。
- [x] 保留 AI 主线原有 `#chapter-2` 等数字深链，不破坏既有 AI 章节入口。
- [x] 刷新或直接打开岗位深链时，自动设置正确路线、章节、场景 ID 和当前关卡号，不再回到 AI 主线或产品密室。
- [x] 章节卷宗的「进入第 N 章教学关卡」按当前选中岗位章节进入，不再只允许当前 AI 进度章节。
- [x] 修正岗位 TeachingBridge 封面错误前缀：Java/前端后续章显示自己的成长路线，不再显示「AI 开发主线」。
- [x] 修正通用序章委托文案：岗位章节不再残留「沿着一次保存请求」旧第一章说明。
- [x] 自动化：`src/App.test.tsx` 新增深链回归，锁定 `#chapter-java-2` 和 `#chapter-frontend-4` 进入对应 TeachingBridge 且无错误 AI 前缀。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：Lint、TypeScript、9 个测试文件 / 169 个测试。
- [x] 浏览器：隔离 API `4333`、临时 SQLite `/tmp/code-quest-r273.sqlite`、Vite `5183`，桌面 `1200×760` 和移动 `390×844` 批量跑 Java 第 2-5 章、前端第 2-5 章共 16 条深链全部通过。
- [x] 浏览器验收确认每条深链可进入教学序章、点击「开始闯关」、看到剧情角色和本章地点航线，暗色背景、WebP 场景、无横向溢出、console error 为 0，且没有「AI 开发主线」「产品密室」「沿着一次保存请求」串线。
- [ ] 停留边界：还没有完成真实沙盒修复、报告回读、跨项目迁移复测和最终合并审查。

验收目标：Java/前端路线后续关卡不只是地图上能点，而是可以像 AI 主线一样被直接打开、刷新恢复和进入专属剧情教学；用户不会因为错误前缀或旧第一章文案误以为自己又回到了 AI 主线。

## R274：实战通过报告证据护照

- [x] 通过态测试报告新增「报告证据护照」，显示生成时间、源码指纹、测试汇总和仍待人工说明的覆盖边界。
- [x] 保留通过测试名称清单，继续让用户能把“哪些测试证明了修复”复述出来。
- [x] 明确提醒：即使测试通过，仍要说明没覆盖的路径和要继续人工复测的风险，不能把绿色状态冒充完全掌握。
- [x] 移动端样式改为单列，避免证据护照四格在手机宽度造成横向挤压。
- [x] `src/App.test.tsx` 通过态测试覆盖「报告证据护照」、源码指纹短码和 `2 通过 / 0 失败` 汇总。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、9 个测试文件 / 169 个测试、生产构建和 TeachingBridge 懒加载检查。
- [ ] 停留边界：真实沙盒修复与报告回读仍需用户在沙盒中手动运行测试后完成；本轮只是让通过报告更可解释。

验收目标：用户读到通过报告时，不只看到“测试通过”，还能知道这份证据何时生成、对应哪份源码、证明了哪些测试、还缺哪些人工边界说明。

## R275：迁移复测报告证据护照

- [x] `TransferRetestLab` 通过态新增「复测报告证据护照」，和主实战 Lab 保持同一学习解释逻辑。
- [x] 护照展示生成时间、源码指纹短码、测试汇总和“变式差异与人工复测风险”，避免迁移题只剩绿色状态灯。
- [x] 保留报告 message 和每条测试名称，让用户能复述“这次通过到底证明了什么”。
- [x] 新增 `src/TransferRetestLab.test.tsx`，模拟第 11 章迁移复测通过报告，锁定护照、短码、`2 通过 / 0 失败` 和测试清单。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/TransferRetestLab.test.tsx --run` 通过：1 个测试文件 / 1 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。
- [x] 浏览器：隔离 API `4335`、临时 SQLite `/tmp/code-quest-r275.sqlite`、Vite `5185`，确认第 11 章复测卡已解锁；桌面复测页显示「复测报告证据护照」、源码短码、`2 通过 / 0 失败` 和通过测试名称。
- [x] 390×844 浏览器验收：`scrollWidth = clientWidth = 390`，证据护照可见，控制台 error 为 0；截图在 `output/playwright/.playwright-cli/page-2026-07-15T07-40-04-714Z.png`。
- [ ] 继续真实沙盒修复与报告回读和最终合并审查。

验收目标：用户进入迁移复测时，仍然能用同一套证据语言理解“当前源码、测试结果、人工风险”的关系，不会在主 Lab 和复测 Lab 之间出现学习逻辑断层。

## R276：实战材料接力解释条

- [x] `ArtifactViewer` 新增「材料接力」解释，说明当前材料从哪里来、交给谁、回答什么问题。
- [x] Network/JSON 材料说明为「浏览器 Network 或测试报告 → 后端接口与验收判断」，帮助用户理解请求证据不是孤立 JSON。
- [x] 日志、SQL、代码材料分别说明后端现场、数据事实校验、代码改动/Agent 委托的接力位置。
- [x] 手机端接力条改为单列，避免“从/交给/问题”挤在一行。
- [x] `src/App.test.tsx` 覆盖材料接力解释、来源、交付对象和证据问题提示。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器：隔离 API `4336`、临时 SQLite `/tmp/code-quest-r276.sqlite`、Vite `5186`，补齐第一章教学进度后进入实战「读取项目材料」阶段，桌面可见「材料接力解释」。
- [x] 390×844 浏览器验收：`scrollWidth = clientWidth = 390`，材料接力可见，控制台 error 为 0；截图在 `output/playwright/.playwright-cli/page-2026-07-15T07-59-49-259Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。
- [ ] 继续真实沙盒修复与报告回读和最终合并审查。

验收目标：用户打开材料时，不再只看到文件和关键行，而是先知道这份证据处在“谁把什么交给谁”的哪一棒，以及它应该回答哪个工作问题。

## R277：实战当前能力印记

- [x] 实战页在冒险日志后新增「当前能力印记」，把当前步骤和角色成长目标连接起来。
- [x] 能力印记显示本关最终证明的工程能力、当前正在练的动作，以及会沉淀成的成长档案/面试素材。
- [x] 基线、作答、验证三类步骤会显示不同的“正在练”动作，避免用户把所有阶段看成一样的表单。
- [x] 手机端能力印记改为单列，保持可读性。
- [x] `src/App.test.tsx` 覆盖「当前能力印记」「正在练」「会沉淀成」和第一章成长档案沉淀内容。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器：隔离 API `4337`、临时 SQLite `/tmp/code-quest-r277.sqlite`、Vite `5187`，补齐第一章教学进度后进入实战「读取项目材料」阶段，桌面可见「当前能力印记」。
- [x] 390×844 浏览器验收：`scrollWidth = clientWidth = 390`，能力印记可见，控制台 error 为 0；截图在 `output/playwright/.playwright-cli/page-2026-07-15T08-12-14-854Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。
- [ ] 继续真实沙盒修复与报告回读和最终合并审查。

验收目标：用户在实战中不只是在填答案，而是能持续看见“我正在练哪种工程能力、这一步会变成什么成长证据”。

## R278：实战步骤收录回执

- [x] 实战页保存作答后新增「证据已收录」回执，显示刚刚写入本地记录的是哪一步。
- [x] 回执解释当前已经进入哪一步，以及上一棒证据正在交给下一棒，降低保存后自动跳转的断层感。
- [x] 用户手动点击侧边栏或基线入口切换阶段时清空回执，避免旧提示停在错误阶段。
- [x] 手机端回执改为单列，不挤压步骤名和解释文本。
- [x] 新增 changelog fragment：`changelogs/2026-07-15-lab-step-receipt.md`。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试；主流程覆盖保存「读取项目材料」后出现「刚刚收录的证据」「证据已收录」「读取项目材料」。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器：隔离 API `4338`、临时 SQLite `/tmp/code-quest-r278.sqlite`、Vite `5188`，从新用户序章进入路线大厅，补齐第 1 章教学进度后进入实战「读取项目材料」，保存后桌面可见「刚刚收录的证据」并自动进入「还原数据流」。
- [x] 390×844 浏览器验收：`scrollWidth = clientWidth = 390`，回执可见，控制台 error 为 0；截图在 `.playwright-cli/page-2026-07-15T08-38-23-002Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。
- [ ] 继续真实沙盒修复与报告回读和最终合并审查。

验收目标：用户在实战页点击保存后，不会突然被丢到下一题；页面会明确告诉他上一段证据已经收录、下一步为什么继续，从而让真实项目流程像剧情接力一样连贯。

## R279：实战剧情向导

- [x] 实战练习页在冒险日志后新增「实战剧情向导」，用当前章节角色立绘承接真实项目练习。
- [x] 向导卡显示角色名、当前实战场景、这一幕先看懂什么、当前流程地点和行动指令。
- [x] 基线、作答和测试步骤使用不同场景名与行动文案，避免每一步都像同一个表单。
- [x] 手机端向导卡改为头像 + 台词 + 单列行动指令，减少挤压和横向溢出风险。
- [x] 新增 changelog fragment：`changelogs/2026-07-15-lab-scene-guide.md`。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试；主流程覆盖进入实战「读取项目材料」时显示「实战剧情向导」、档案馆记录员立绘、「这一幕先看懂：读取项目材料」「当前地点」和「行动指令」。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器：隔离 API `4339`、临时 SQLite `/tmp/code-quest-r279.sqlite`、Vite `5189`，从新用户序章进入路线大厅，补齐第 1 章教学进度后进入实战「读取项目材料」；桌面可见「实战剧情向导」、档案馆记录员立绘、「这一幕先看懂：读取项目材料」、当前地点「发出 POST」和行动指令。
- [x] 390×844 浏览器验收：`scrollWidth = clientWidth = 390`，向导正文完整，控制台 error 为 0；截图在 `.playwright-cli/page-2026-07-15T09-00-20-050Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。
- [ ] 继续真实沙盒修复与报告回读和最终合并审查。

验收目标：用户进入实战页后不会从剧情 RPG 突然掉回普通表单；每一步都有角色带路、地点感和明确行动，让真实项目练习仍像一段可继续推进的剧情。

## R280：实战本步任务卷轴

- [x] 实战练习页在剧情向导后新增「本步任务卷轴」，把当前步骤压缩成「为什么学 / 先看什么 / 最后交什么」。
- [x] 基线、材料作答和测试验收步骤分别生成学习目的、证据入口和最终产出，避免用户看到代码前先迷路。
- [x] 手机端卷轴改为单列展示，优先保证一屏内阅读顺序清楚、不横向溢出。
- [x] 新增 changelog fragment：`changelogs/2026-07-15-lab-step-quest-brief.md`。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试；主流程覆盖进入实战「读取项目材料」时显示「本步任务卷轴」「为什么学」「先看什么」「最后交什么」和当前步骤目标。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器桌面验收：隔离 API `4340`、临时 SQLite `/tmp/code-quest-r280.sqlite`、Vite `5190`，进入第 1 章实战「读取项目材料」时可见「本步任务卷轴」「为什么学」「先看什么」「最后交什么」和当前步骤目标。
- [x] 390×844 浏览器验收：卷轴单列完整可读，`scrollWidth = clientWidth = 390`，控制台 error 为 0；截图在 `.playwright-cli/page-2026-07-15T09-25-28-102Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。Vite 主包体积 warning 仍是已知债务，不是失败。
- [ ] 继续真实沙盒修复与报告回读和最终合并审查。

验收目标：用户进入每一步实战之前，先知道这一小步为什么值得学、应该先看哪类证据、最后要交什么成果，从而把工程流程理解成连续的任务接力，而不是被代码和名词砸晕。

## R281：实战流程接力小剧场

- [x] 实战练习页在任务卷轴后新增「流程接力小剧场」，用上一棒、当前棒、下一棒的短对白解释工程链路。
- [x] 当前步骤会把 `flowItems` 里的上一站、当前站、下一站串成“谁把什么交给谁”的剧情表达，优先解决用户反馈的 `response.ok` 到底传给谁、下一地点为什么出现的困惑。
- [x] 手机端改为单列纵向接力，避免三栏对白在 390px 下挤压。
- [x] 新增 changelog fragment：`changelogs/2026-07-15-lab-flow-dialogue.md`。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试；主流程覆盖进入实战「读取项目材料」时显示「流程接力小剧场」「上一棒」「当前棒」「下一棒」和前端、后端接口接力。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器桌面验收：隔离 API `4341`、临时 SQLite `/tmp/code-quest-r281.sqlite`、Vite `5191`，进入第 1 章实战「读取项目材料」时可见「流程接力小剧场」「上一棒」「当前棒」「下一棒」和前端到后端接口接力。
- [x] 390×844 浏览器验收：小剧场单列完整可读，`scrollWidth = clientWidth = 390`，控制台 error 为 0；截图在 `.playwright-cli/page-2026-07-15T09-40-03-708Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。Vite 主包体积 warning 仍是已知债务，不是失败。

验收目标：用户不需要自己脑补“谁把什么传给谁”；页面用剧情对白把当前材料放进完整工作流程，让代码阅读前先建立流程记忆。

## R282：材料代码三步翻译卡

- [x] 实战材料阅读区在关键行聚焦后新增「代码三步翻译卡」，把最多前三个关键代码片段翻译成流程里的动作。
- [x] `fetch/POST`、`response.ok/201`、`setStatus/onSaved/saved`、`SELECT/0 rows`、测试报告等常见证据会生成不同的人话解释，强调“能证明什么 / 不能证明什么”。
- [x] 手机端翻译卡改为单列，避免三张解释卡在 390px 下挤压。
- [x] 新增 changelog fragment：`changelogs/2026-07-15-artifact-code-translation.md`。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试；主流程覆盖进入实战「读取项目材料」时显示「代码三步翻译卡」「把动作送出去」「判断接口有没有接住」和“不能直接证明数据库已经写入”。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器桌面验收：隔离 API `4342`、临时 SQLite `/tmp/code-quest-r282.sqlite`、Vite `5192`，进入第 1 章实战「读取项目材料」时可见「代码三步翻译卡」「把动作送出去」「判断接口有没有接住」和“不能直接证明数据库已经写入”。
- [x] 390×844 浏览器验收：翻译卡单列完整可读，`scrollWidth = clientWidth = 390`，控制台 error 为 0；截图在 `.playwright-cli/page-2026-07-15T10-00-30-035Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。Vite 主包体积 warning 仍是已知债务，不是失败。

验收目标：用户看到关键代码时，不再只看到英文函数和状态判断，而能马上把它翻译成工程流程里的角色动作。

## R283：作答证据表达示范卡

- [x] 实战作答区在作答支架后新增「证据表达示范卡」，用“我看到 / 它说明 / 下一步”的短句示范证据表达。
- [x] 普通证据题示范 `POST`、`response.ok`、数据库写入边界和后端日志/`SELECT` 下一步；Agent 委托题示范背景、目标、验收和风险。
- [x] 新增 changelog fragment：`changelogs/2026-07-15-answer-expression-example.md`。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试；主流程覆盖进入实战「读取项目材料」时显示「证据表达示范卡」「前端发出了 POST」「还不能证明数据库真的写入」和“继续查后端日志和 SELECT 结果”。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器桌面验收：隔离 API `4343`、临时 SQLite `/tmp/code-quest-r283.sqlite`、Vite `5193`，进入第 1 章实战「读取项目材料」时可见「证据表达示范卡」「前端发出了 POST」「还不能证明数据库真的写入」和“继续查后端日志和 SELECT 结果”。
- [x] 390×844 浏览器验收：示范卡完整可读，`scrollWidth = clientWidth = 390`，控制台 error 为 0；截图在 `.playwright-cli/page-2026-07-15T10-28-18-491Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。Vite 主包体积 warning 仍是已知债务，不是失败。

验收目标：用户不只会看材料，还知道怎样把证据写成可保存、可验收、可复盘的表达。

## R284：实战保存能力沉淀回执

- [x] 实战保存回执从单句提示扩展为「刚刚沉淀 / 下一步验证 / 以后可复盘」三项。
- [x] 保存普通作答后会显示“一段可复查的当前步骤判断”，并说明下一步验证方向和本关复盘产出。
- [x] 手机端回执三项改为单列，避免 390px 下挤压。
- [x] 新增 changelog fragment：`changelogs/2026-07-15-lab-receipt-learning-output.md`。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试；主流程覆盖保存「读取项目材料」后出现「刚刚沉淀」「下一步验证」「以后可复盘」和“一段可复查的读取项目材料判断”。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] 浏览器桌面验收：隔离 API `4344`、临时 SQLite `/tmp/code-quest-r284.sqlite`、Vite `5194`，保存「读取项目材料」后可见「刚刚沉淀」「下一步验证」「以后可复盘」和“一段可复查的读取项目材料判断”。
- [x] 390×844 浏览器验收：保存回执完整可读，`scrollWidth = clientWidth = 390`，控制台 error 为 0；截图在 `.playwright-cli/page-2026-07-15T10-58-46-901Z.png`。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。Vite 主包体积 warning 仍是已知债务，不是失败。

验收目标：用户保存作答后能明确知道这一步已经变成什么学习证据、下一步为什么继续，而不是被动跳到下一题。

## R285：第一章实战步骤场景导演层

- [x] `LabStep` 支持逐步配置 `scene`，包含地点、背景、角色、台词、目标和通关收获。
- [x] 第一章实战 8 个步骤分别配置不同地点和角色：档案馆记录员、传送门书记官、接口接待员、回声取证官、任务锻造师、交付审判官、镜面编辑师和面试策士。
- [x] `LabSceneGuide` 改为读取当前步骤场景，卡片背景和外层实战背景会随步骤切换，避免整个实战一直停在同一个人和同一张图。
- [x] 保存「读取项目材料」后会进入「还原数据流」，从「传送门书记官 · 前端讯号窗」切到「接口接待员 · 请求中转门」，并保留「刚刚收录的证据」回执。
- [x] 新增 changelog fragment：`changelogs/2026-07-16-lab-step-scenes.md`。
- [x] Node `v24.13.1` 下 `npm run format:check` 通过。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试；主流程覆盖第一步场景和保存后的第二步场景。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。Vite 主包体积 warning 仍是已知债务，不是失败。
- [x] 浏览器桌面验收：隔离 API `4345`、临时 SQLite `/tmp/code-quest-r285.sqlite`、Vite `5195`，第 1 章从教学完成页进入实战后，第一步显示「传送门书记官」「前端讯号窗」和「读取项目材料」。
- [x] 浏览器保存流验收：填写证据答案并点击「保存并继续」后，自动进入「还原数据流」，显示「接口接待员」「请求中转门」「刚刚收录的证据」和「继续把上一棒证据交给下一棒」。
- [x] 390×844 浏览器验收：`scrollWidth = clientWidth = 390`，向导包含「接口接待员」「请求中转门」，回执完整可读，控制台 error 为 0；截图在 `.playwright-cli/page-2026-07-15T18-51-10-368Z.png`。

验收目标：用户在第一章实战里推进每一步时，能感觉自己进入了不同地点、遇到不同角色、接住上一棒证据并交给下一棒，而不是在同一个静态表单里反复答题。

## R286：第 2 章产品链路实战场景导演层

- [x] 第 2 章 `canvasstorm-product-brief` 实战步骤补齐 `scene`，包含地点、背景、角色、台词、目标和通关收获。
- [x] 「读 Project Brief」使用灵感萤火和 Brief 星图桌，强调先把 AI 点子翻译成用户目标、输入、输出和约束。
- [x] 「筛方向候选」切到产品链路带读官和方向筛选台，强调 MVP 不是把所有未来想法都塞进本轮执行草案。
- [x] 沙盒测试、Agent 委托、交付审查和面试复盘分别切到会话账本库、委托锻造台、交付审查席和面试讲述厅。
- [x] 新增 changelog fragment：`changelogs/2026-07-16-case02-lab-step-scenes.md`。
- [x] `src/App.test.tsx` 覆盖第 2 章进入实战后显示「灵感萤火」「Brief 星图桌」「点亮 Brief 星图」，保存后切到「产品链路带读官」「方向筛选台」并显示「刚刚收录的证据」。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。
- [ ] 浏览器桌面/390px 抽检尚未补录；如果时间紧，先提交推送保留完整代码与自动化证据，下一轮优先补第 2 章实战浏览器验收。

验收目标：第 2 章实战不再像复用第 1 章表单，而是让用户在产品密室里逐步经历 Brief 星图、方向筛选、会话账本、委托锻造、交付审查和面试讲述，理解 AI 点子如何变成可执行产品链路。

## R287：第 2 章产品链路新手翻译

- [x] `LabStep` 新增 `questBrief` 和 `flowDialogue`，允许每个实战步骤配置自己的学习目的、证据入口、交付产出和接力对白。
- [x] 第 2 章 7 个实战步骤补齐专属解释：读 Brief、筛候选、会话保存、Agent 委托、交付审查和面试复盘都用产品链路语言讲清楚。
- [x] 「读 Project Brief」会解释 Project Brief 是 AI 功能的任务契约，不是介绍文案；它决定后端规划器如何筛候选。
- [x] 「筛方向候选」会解释候选池像装备栏，本轮 MVP 只拿能验证当前目标的候选，growth 想法要记录为拒绝理由。
- [x] 新增 changelog fragment：`changelogs/2026-07-16-case02-lab-learning-translation.md`。
- [x] `src/App.test.tsx` 覆盖第 2 章实战首幕和第二幕的新手卷轴与接力对白。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：10 个测试文件 / 170 个测试。

验收目标：用户进入第 2 章实战时，不只是看到新背景和新角色，还能直接读懂“这一步为什么学、该看什么证据、要交给下一棒什么”，减少从剧情到产品逻辑之间的断层。

## R288：第 2 章浏览器验收与串章修复

- [x] 修复第 2 章教学完成页串章：不再用「AI 状态台 / 安全记录员 / API Key」作为会合前夜场景，改为「产品复盘厅 / 面试策士」收束产品链路表达。
- [x] `canvasStormScenes` 保持 4 个本章相关地点：Project Brief 前台、方向选择大厅、会话档案库、产品复盘厅。
- [x] `src/chapterCinematics.test.ts` 增加防回退断言：第 2 章教学场景包含产品复盘厅，不包含 AI 状态台，也不包含 API Key 文案。
- [x] 浏览器桌面验收：隔离 API `4348`、临时 SQLite `/tmp/code-quest-r288.sqlite`、Vite `5198`；第 2 章会合页显示「产品复盘厅 / 面试策士」，无「AI 状态台」。
- [x] 浏览器桌面实战：进入「读 Project Brief」首幕后可见「灵感萤火」「Brief 星图桌」「Project Brief 是 AI 功能的任务契约」「Brief 不是介绍文案」和关键行导读；`clientWidth = scrollWidth = 1200`，背景为暗色。
- [x] 浏览器桌面保存流：填写 Brief 作答并保存后进入「产品链路带读官 · 方向筛选台」，显示「真实 AI 产品不是把所有点子都做进去」「候选池像装备栏」和「刚刚沉淀 / 读 Project Brief」回执；`clientWidth = scrollWidth = 1200`。
- [x] 浏览器 390×844 抽检：第 2 章第二幕显示「产品链路带读官」「方向筛选台」「真实 AI 产品不是把所有点子都做进去」「候选池像装备栏」；`clientWidth = scrollWidth = 390`，背景为暗色，console error 为 0。截图：`.playwright-cli/page-2026-07-16T08-33-50-456Z.png`。
- [x] Node `v24.13.1` 下 `npm run test -- src/chapterCinematics.test.ts src/App.test.tsx --run` 通过：2 个测试文件 / 53 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 170 个测试。

验收目标：第 2 章不再把 AI API 安全内容提前塞入产品链路章；真实浏览器证明第 2 章会合、实战首幕、保存后第二幕和 390px 布局不会断层。

## R289：教学桥控件暗色 RPG 收口

- [x] 概念卡、预测题、预测错误态、解释框、流程图节点编号、节点接力标签和 footer 继续提示补齐暗色 RPG 覆盖。
- [x] 保留现有章节角色与场景资产，不新增仓促图片；优先把已有 WebP 人物和场景所在的教学壳统一起来。
- [x] 新增 changelog fragment：`changelogs/2026-07-16-teaching-control-dark-rpg.md`。
- [x] `src/chapterCinematics.test.ts` 增加样式回归断言，保护教学桥关键控件不退回白底课件壳。
- [x] Node `v24.13.1` 下 `npm run test -- src/chapterCinematics.test.ts --run` 通过：1 个测试文件 / 8 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 171 个测试。
- [x] 浏览器桌面验收：隔离 API `4350`、临时 SQLite `/tmp/code-quest-r289.sqlite`、Vite `5200`；第 1 章剧情页显示完整流程卷轴、名词小抄、本幕复盘和下一地点预告，控制台 error 为 0，`clientWidth = scrollWidth = 1200`，body 背景为暗色。
- [x] 浏览器 390×844 抽检：第 1 章剧情页仍显示完整流程卷轴、名词小抄、本幕复盘；`clientWidth = scrollWidth = 390`，body 背景为暗色。

验收目标：用户在项目地图、概念卡和预测题之间切换时，不再感觉从神秘剧情 RPG 突然跳回白色课程后台。

## R290：代码导读当前行证据锚点

- [x] `GuidedCodeTour` 增加“当前行证据锚点”：每行都显示为什么看这一行、检查点、下一份证据。
- [x] 第 1 章读到 `response.ok` 时明确提示：它解释绿色成功提示为什么会亮，但不能证明数据库已经写入，下一步要看 Network、后端日志和数据库 SELECT。
- [x] 390px 下当前行证据锚点改成单列，避免代码阅读页挤压。
- [x] 新增 changelog fragment：`changelogs/2026-07-16-code-tour-evidence-anchor.md`。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 171 个测试。
- [x] 浏览器桌面验收：隔离 API `4352`、临时 SQLite `/tmp/code-quest-r290.sqlite`、Vite `5202`；第 1 章 `tour-frontend` 代码导读页显示当前行证据锚点。跳到 `response.ok` 行后可见“绿色成功提示为什么会亮”“不能证明数据库已经写入”“Network 状态码、后端日志、数据库 SELECT 结果”；console error 为 0，`clientWidth = scrollWidth = 1200`，body 背景为暗色。
- [x] 浏览器 390×844 抽检：第 1 章代码导读页仍显示“为什么看这一行”“下一份证据”“不能证明数据库已经写入”；`clientWidth = scrollWidth = 390`，body 背景为暗色。

验收目标：用户进入代码阅读页时，不只是看到一行代码和语法解释，还能知道“为什么现在看它、它能证明什么、下一步要去哪找证据”。

## R291：跨电脑交接与合并状态刷新

- [x] `docs/cross-computer-handoff.md` 重写为 2026-07-16 最新接手说明，明确仓库、分支、远端 hash、拉取命令、完整性检查命令、当前完成情况和合并建议。
- [x] `HANDOFF.md` 顶部事实快照更新到功能基线 `d77761a feat(rpg): anchor code tour lines to evidence` 和交接刷新 `docs(rpg): refresh cross-computer handoff`，避免新 Agent 或另一台电脑误把旧提交当最新状态。
- [x] `docs/cx-ai-career-rpg-home-merge-notes.md` 更新功能基线、交接刷新、约 65% 阶段完成度、最新快速验证和合并前必须重新完整验证的边界。
- [x] 当前本地分支 `cx/ai-career-rpg-home` 已核对等于 `origin/cx/ai-career-rpg-home`；最终远端 hash 以 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 为准，避免文档提交后硬编码 hash 过期。
- [x] 结论明确：另一台电脑可以直接拉 `cx/ai-career-rpg-home` 继续开发；现在不建议直接合并 `main`，应继续开发、验收，再开 PR 审查。

验收目标：用户换电脑或开新任务时，能按文档确认是否拉完整、知道当前完成到哪里、下一步怎么接、以及为什么现在不应该直接合并。

## R292：实战测试报告证据桥

- [x] `VerificationPanel` 新增「验收证据桥」，把测试报告翻译成“证明了什么 / 还没证明什么 / 怎么带走或下一步怎么做”。
- [x] 测试通过时不只显示绿灯和测试名，还会说明绿色报告不能覆盖所有风险，并提示如何写进 Agent 交付和面试复盘。
- [x] 测试失败时不把红灯写成挫败，而是提示失败报告指出下一处断点，并把红灯转成可交给 Agent 的任务描述。
- [x] 暗色 RPG 样式已补，桌面三列、窄屏单列，避免 390px 阅读挤压。
- [x] `src/App.test.tsx` 覆盖通过和失败两种报告状态，防止证据桥退回普通报告卡。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 171 个测试。
- [x] 浏览器验收：隔离 API `4354`、临时 SQLite `/tmp/code-quest-r292.sqlite`、Vite `5204`；第 1 章实战「沙盒修复与测试」显示「验收证据桥」「失败报告已经指出下一处断点」「不能把局部修改当成修好」「把红灯变成 Agent 任务」。
- [x] 浏览器布局验收：桌面 `1280px` 与 390×844 均为 `clientWidth = scrollWidth`，body 背景为暗色 `rgb(7, 12, 20)`，控制台 error 为 0。

验收目标：用户在实战验收页读到测试报告时，能理解这份报告到底能证明什么、不能证明什么、下一步怎么修或怎么写进求职表达，而不是只看到“通过/失败”。

## R293：第 1 章红灯报告断点校准

- [x] 修正 `buildVerificationClue` 的匹配优先级：第 1 章“POST 成功后重新查询仍能读到画布 / 数据库 0 条”现在优先命中数据持久化断点，不会误导到第 2 章会话保存话术。
- [x] 红灯断点文案改为“数据层写库这一棒没接上：接口返回成功，但刷新后的数据库查询仍然读不到记录”。
- [x] 下一步文案明确要求回到 repository 的 `saveCanvas`，确认执行数据库 `INSERT`，再用刷新查询和测试报告证明落库。
- [x] `src/App.test.tsx` 新增第 1 章失败报告回归测试，确保不再出现“会话保存这一棒缺证据”。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 47 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 172 个测试。
- [x] 浏览器验收：隔离 API `4356`、临时 SQLite `/tmp/code-quest-r293.sqlite`、Vite `5206`；第 1 章实战「沙盒修复与测试」显示“数据层写库这一棒没接上”和“执行数据库 INSERT”，不再显示“会话保存这一棒缺证据”。
- [x] 浏览器布局验收：桌面 `1200px` 与 390×844 均为 `clientWidth = scrollWidth`，控制台 error 为 0。

验收目标：用户在第 1 章测试失败时，报告解释必须贴合“前端成功提示 vs 数据库没写入”的真实故障，不把不同章节的产品会话概念混进来。

## R294：继续开发前交接完整性刷新

- [x] 重新运行 `xixi-dev-system profile sync`、`doctor --project .` 和 `updates --project .`；doctor 通过。
- [x] 重新执行 `git fetch origin`、`git status --short --branch`、`git rev-parse HEAD origin/cx/ai-career-rpg-home` 和 `git ls-remote origin refs/heads/cx/ai-career-rpg-home`，确认本地当前功能代码与远端 `cx/ai-career-rpg-home` 一致，检查时 hash 为 `dca300e34539f47b76aa540edc7084c5b6e39659`。
- [x] 记录远端默认 HEAD 当前指向 `feat/guided-learning-bridge`，另一台电脑必须显式 checkout `cx/ai-career-rpg-home`，否则会拉到旧线。
- [x] 更新 `HANDOFF.md`、`docs/cross-computer-handoff.md` 和 `docs/cx-ai-career-rpg-home-merge-notes.md`，把最新功能基线、测试证据、浏览器验收、合并建议和下一步补齐。
- [x] 明确当前结论：本分支可以被另一台电脑完整拉取继续开发；还不建议直接合并，除非先开 PR、重新跑完整 `npm run verify` 并完成关键路径浏览器验收。

验收目标：用户睡觉或换电脑后，不会因为默认分支、过期 hash、文档滞后或分支太多而重新做一遍；接手者能直接知道拉哪个分支、当前完成什么、下一步做什么、为什么暂时不建议直接合并。

## R295：第 1 章实战后半段流程对白收口

- [x] 第 1 章「沙盒修复与测试」补齐专属流程对白，说明后端接口已经把保存动作交给数据层，当前要用沙盒测试、刷新查询和源码指纹证明修复成立。
- [x] 第 1 章「给 Agent 写任务」补齐专属流程对白，强调把验收报告交给 Agent，不是把愿望丢给 Agent。
- [x] 第 1 章「审查交付说明」「解释故障因果」「面试迁移题」补齐专属流程对白，形成沙盒验收 → Agent 委托 → 交付审查 → 因果解释 → 面试迁移的学习链。
- [x] `src/App.test.tsx` 增加防回退断言：这些步骤不允许再显示“数据库 把线索交给 数据库”的机械兜底。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 47 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 172 个测试。
- [x] 浏览器验收：隔离 API `4358`、临时 SQLite `/tmp/code-quest-r295.sqlite`、Vite `5208`；第 1 章实战后半段「沙盒修复与测试」「给 Agent 写任务」「审查交付说明」「解释故障因果」「面试迁移题」均显示专属流程对白。
- [x] 浏览器布局验收：桌面 `1200px` 与 390×844 均为 `clientWidth = scrollWidth`；页面暗色背景 `rgb(7, 12, 20)`，控制台 error 为 0，未出现“数据库 把线索交给 数据库”。

验收目标：用户在第 1 章实战后半段切换步骤时，能知道上一站交了什么、当前要证明什么、下一站为什么出现；不再被重复的数据库节点对白弄晕。

## R296：第 2 章红灯报告分类校准

- [x] 调整 `buildVerificationClue` 关键词优先级，让“保存会话时记录 Brief、方向、取舍理由和下一步”优先命中会话保存断点，而不是被 `Brief` 或“候选”误导到输入/方向筛选断点。
- [x] 保留第 2 章方向筛选红灯：执行草案包含非 MVP 候选时，仍指向规划器的 direction 过滤和 acceptedCandidates。
- [x] 保留第 2 章输入红灯：用户目标为空时，仍指向 Brief/userGoal 输入校验和可读错误。
- [x] `src/App.test.tsx` 覆盖同一份第 2 章失败报告中的三类红灯：方向筛选、会话保存、空目标输入。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 47 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 172 个测试。
- [x] 浏览器验收：隔离 API `4360`、临时 SQLite `/tmp/code-quest-r296.sqlite`、Vite `5210`；第 2 章实战验收页桌面显示三个独立红灯断点，390×844 下 `clientWidth = scrollWidth = 390`，body 背景为暗色。
- [x] 浏览器控制台 error 为 0；报告不是“报告还不能作为通过证据”的无效状态。

验收目标：用户读第 2 章失败测试报告时，能知道每个红灯应该回到哪份材料和哪一棒链路；不会把“会话保存缺证据”误以为只是“方向筛选”或“Brief 输入”问题。

## R297：实战红灯作战顺序

- [x] 失败报告新增「红灯总指挥 / 红灯作战顺序」，在单个红灯详情前先给出第 1 棒、第 2 棒、第 3 棒的排查顺序。
- [x] 作战顺序会把每个失败测试翻译成流程断点，提醒用户先找最早断掉的交接棒，不要三处一起改。
- [x] 新增「交给 Agent 的口令」，把失败测试名、断点和下一步动作压成一段可复制思路，帮助用户把红灯变成任务。
- [x] 暗色 RPG 样式已补，桌面三列作战卡，390px 移动端自动单列，减少来回横向扫读。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 47 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 172 个测试。
- [x] 浏览器验收：隔离 API `4362`、临时 SQLite `/tmp/code-quest-r297.sqlite`、Vite `5212`；第 2 章进入实战「沙盒修复与测试」后读取失败报告，桌面和 390×844 均显示「红灯总指挥」「第 1 棒 / 第 2 棒 / 第 3 棒」「交给 Agent 的口令」。
- [x] 浏览器布局验收：桌面 `clientWidth = scrollWidth = 1200`，390×844 下 `clientWidth = scrollWidth = 390`，body 背景为暗色 `rgb(7, 12, 20)`，控制台 error 为 0，报告不是无效状态。

验收目标：用户看到多项失败测试时，先读到一个总览行动顺序，再进入每个红灯细节；不会在方向筛选、会话保存和空目标输入之间跳来跳去。

## R298：第 2 章后半段交付口令卡

- [x] 实战作答页新增「本步交付口令」，只在 Agent 委托、交付审查和面试复盘等产出型步骤显示。
- [x] 「给 Agent 写任务」显示 Agent 协作口令：背景、边界、验收三段，提醒不能为了过测试绕开业务规则。
- [x] 「审查交付说明」显示交付审查口令：已证明、未证明、决定三段，训练用户先看证据再接收或退回。
- [x] 「面试复盘」显示面试复盘口令：场景、行动、结果三段，把排障过程整理成 STAR。
- [x] 该组件接在新手先读卡和作答支架之间，目标是让用户写之前先知道本步要交出什么格式。
- [x] Node `v24.13.1` 下 `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 47 个测试。
- [x] Node `v24.13.1` 下 `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 172 个测试。
- [x] 浏览器验收：隔离 API `4364`、临时 SQLite `/tmp/code-quest-r298.sqlite`、Vite `5214`；第 2 章进入实战后分别切到「给 Agent 写任务」「审查交付说明」「面试复盘」，桌面均显示对应交付口令。
- [x] 浏览器布局验收：桌面 `clientWidth = scrollWidth = 1200`，390×844 下 `clientWidth = scrollWidth = 390`，body 背景为暗色 `rgb(7, 12, 20)`，控制台 error 为 0。

验收目标：第 2 章后半段不再只是普通文本框；用户进入 Agent、审查和面试步骤时，能先看到对应的工作产出结构，再开始写答案。

## R304：合并前跨电脑完整性复核（历史记录，最新以 R315 为准）

- [x] 重新运行 `xixi-dev-system profile sync`、`doctor --project .` 和 `updates --project .`；doctor 通过。
- [x] 当时核对本地与远端：功能代码核对到 `1a40fe453b5170042410ac3b0aa7455b36005fd0`；交接文档至少包含 `9171ac8 docs(rpg): refresh merge readiness handoff`。该记录已被 R315 的 `4370ddf` 核对替代，当前远端 hash 以 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 与 `git rev-parse origin/cx/ai-career-rpg-home` 比对结果为准。
- [x] Node `v24.13.1` 下完整 `npm run verify` 通过：格式、Lint、TypeScript、10 个测试文件 / 176 个测试、生产构建和 TeachingBridge 懒加载检查。Vite 主包体积 warning 是已知债务，不是失败。
- [x] 补充浏览器抽检记录：隔离 API `4370`、临时 SQLite `/tmp/code-quest-r304.sqlite`、Vite `5220`；桌面 1280 与 390px 下序章、证据选择、领取委托、三路线大厅均无横向溢出，控制台 error 为 0。
- [x] 更新 `HANDOFF.md`、`docs/cross-computer-handoff.md` 和 `docs/cx-ai-career-rpg-home-merge-notes.md`：写清楚拉哪个分支、当前最新提交、验证证据、当前完成约 70%、为什么仍不建议直接合并、下一步怎么接。
- [x] 明确合并边界：当前可以换电脑完整拉取继续开发；不建议直接 merge 到 `main`。如果时间紧，先开 Draft PR 或继续本分支，转 ready 前必须做 PR 审查、全站视觉终审和真人试玩边界说明。

验收目标：另一台电脑不会因为默认分支、过期 hash 或文档滞后拉到不完整内容；接手者能直接知道“已经做了什么、当前还有什么没做、怎么继续、什么时候才适合合并”。

## R305：Java/前端深链剧情方向感补强

- [x] 剧情探索页新增「当前路线身份」铭牌，显示 AI/Java/前端路线、当前案件标题、当前地点和出场角色。
- [x] 教学桥正文页同步新增路线身份铭牌，显示路线、证据路线和当前教学步骤，避免用户从剧情探索进入代码/概念页后忘记自己在哪条路线。
- [x] 更新深链回归测试：`#chapter-java-2` 和 `#chapter-frontend-4` 不只封面正确，点击「开始闯关」后也必须显示 Java/前端成长路线身份，并且不出现 AI 应用开发主线误跳。
- [x] 浏览器批量验收：隔离 API `4371`、临时 SQLite `/tmp/code-quest-r305.sqlite`、Vite `5221`；`#chapter-java-2..5` 与 `#chapter-frontend-2..5` 桌面 1280 和 390px 手机进入剧情探索后，均显示当前路线身份、完整流程卷轴、名词小抄；`scrollWidth === clientWidth`，暗色背景 `rgb(7, 12, 20)`，控制台 error 为 0。

验收目标：用户从 Java/前端第 2-5 章深链进入后，不会只在封面知道自己选了哪个岗位；进入剧情探索和教学正文后仍能持续确认路线身份、当前案件和当前地点。

## R319：实战保存后接力回执

- [x] `LabStepReceipt` 新增「刚刚到下一步的接力」，保存一道实战回答后直接显示“刚刚停在 → 现在进入”，避免页面自动跳到下一步时用户忘记上一棒在讲什么。
- [x] 接力回执读取 `LabConfig.flowItems` 和每步 `flowItemIndex`，显示当前步骤对应的流程棒、下一棒标题，以及“只盯住当前证据，写清后再交给下一棒”的人话提醒。
- [x] 暗色 RPG 样式已补，桌面横向接力，390px 移动端单列，箭头转为向下，避免窄屏挤压。
- [x] `src/App.test.tsx` 新增定向回归：前端性能实战保存后必须出现「刚刚收录的证据」「刚刚到下一步的接力」「刚刚停在」「现在进入」「只盯住」和下一棒标题。
- [x] 当前已通过定向测试：`npm run test -- src/App.test.tsx --run -t "实战保存后会显示具体接力回执"`，1 个测试通过。
- [x] 构建通过：`npm run build` 完成 TypeScript、Vite 生产构建和 TeachingBridge 懒加载 chunk 检查；Vite 主包体积 warning 仍是已知债务，不是失败。
- [x] 低并发测试补充证据：`npm run test -- --no-file-parallelism --maxWorkers=1` 跑过除 `src/App.test.tsx` 外的 9 个测试文件，126 个测试通过；`src/App.test.tsx` 在本机 worker 启动阶段超时，未拿到整文件通过证据。
- [x] 默认完整门禁已如实记录：`npm run verify` 的格式、Lint、TypeScript 已通过，但全量 Vitest 默认并行启动 worker 超时，结果为 4 个测试文件 / 60 个测试通过、6 个 worker 启动失败，因此本轮不能声称完整 `npm run verify` 通过。
- [x] 浏览器部分验收：隔离 API `4392`、临时 SQLite `/tmp/code-quest-r319.sqlite`、Vite `5242`，从 `#chapter-frontend-3` 进入前端第 3 关剧情探索，首屏显示前端路线身份、地点航线、流程卷轴、名词小抄和 2/10 线索收集；尚未走到实战保存回执。
- [ ] 待补完整浏览器验收：从实战页真实保存一道回答，确认桌面和 390px 均显示接力回执、无横向溢出、控制台 error 为 0。

验收目标：用户保存答案后，不只是看到“记录已保存”，而是马上知道上一处证据已经交给谁、现在应该只看哪份材料、下一步为什么出现。

## R324：前端第 5 关沙盒证物归属修复

- [x] `sandbox/frontend-testing-proof` 的 README、Network、手动报告、失败复现、过期通过报告、后端日志和 Agent 交付说明，已从旧“保存画布 / `/api/canvases` / 验收试炼画布”语境改为前端任务列表筛选回归语境。
- [x] 新故事线固定为：用户选择 `status=blocked`，页面可见列表、DOM、Network、报告提交和 `sourceHash` 必须一起证明修复可信。
- [x] 沙盒测试脚本同步改为校验 `GET /api/tasks?status=blocked` 与 `POST /api/reports/verification`，不再要求旧保存请求。
- [x] 沙盒前端面板标题改为「前端回归证据庭」，包名改为 `frontend-regression-proof-sandbox`，避免用户打开材料后又回到 AI 主线验收竞技场。
- [x] 新增 `src/sandboxEvidence.test.ts`，直接扫描 `sandbox/frontend-testing-proof`，防止 `/api/canvases`、`canvas-save-persistence`、保存画布、验收试炼画布、保存后刷新等旧词回流。
- [x] 旧词复扫通过：`rg "/api/canvases|canvas-save-persistence|保存画布|验收试炼画布|保存后刷新|刚保存的画布|画布页面|画布仍|POST 后再 GET|保存逻辑" sandbox/frontend-testing-proof -S` 无结果。
- [x] 定向测试通过：Node `v24.13.1` 下 `npm run test -- src/sandboxEvidence.test.ts --run`，1 个测试通过。
- [x] 快速门禁通过：Node `v24.13.1` 下 `npm run verify:quick`，lint、typecheck、11 个测试文件 / 187 个测试通过。
- [x] 沙盒自身 `npm test` 仍按练习设计失败：5 个失败均来自当前坏实现没有拒绝不可信验收证据；这是本关练习入口，不是主应用门禁失败。

验收目标：用户进入前端第 5 关材料时，剧情、UI 和证物都围绕“前端回归怎么证明修好了”，不会突然看到第一章或 AI 主线的保存画布链路。

## R325：前端第 5 关浏览器串章文案修复

- [x] 浏览器从 `#chapter-frontend-5` 走前端第 5 关时发现 4 类串章文案：主动复述 placeholder 仍举第一章数据库例子；第二幕边界用例仍是 `buildCanvasPayload/title/nodes`；第四幕 Agent 示例仍写“保存刷新后丢失”；Lab 证据表达示范卡仍写 `response.ok` 和数据库写入。
- [x] `TeachingBridge` 已改为按当前线索生成主动复述 placeholder，不再固定“页面成功/数据库写入”例子。
- [x] 前端第 5 关剧情替换表补齐 `buildCanvasPayload`、`title/nodes`、`sourceFingerprint`、保存刷新、`和DOM` 等漏网词，统一为筛选状态、空结果、`sourceHash`、DOM/Network/报告证据。
- [x] `ResponseForm` 接收当前 `scenarioId`，前端第 5 关使用专属新手先读卡、Agent 委托示例和证据表达示范卡，示例固定为 `GET /api/tasks?status=blocked`、DOM 可见行、`sourceHash` 和回归风险。
- [x] `src/App.test.tsx` 加严回归：前端第 5 关剧情和 Lab 渲染都禁止出现 `buildCanvasPayload`、`sourceFingerprint`、保存刷新、`response.ok 后显示 saved`、数据库写入等旧词。
- [x] 定向测试通过：`npm run test -- src/App.test.tsx --run -t "前端第 5"`、`npm run test -- src/App.test.tsx --run -t "岗位 Lab 默认"`、`npm run test -- src/sandboxEvidence.test.ts --run`。
- [x] 浏览器验收：隔离 API `4401`、临时 SQLite `/tmp/code-quest-r325.sqlite`、Vite `5251`；桌面 `1280px` 和 390×844 下 `#chapter-frontend-5` DOM 均无 `response.ok 后显示 saved`、数据库写入、保存刷新、`buildCanvasPayload`、`sourceFingerprint`、`/api/canvases`、验收试炼画布或 `和DOM`，暗色背景 `rgb(7, 12, 20)`，控制台 error 为 0。
- [x] 完整门禁通过：Node `v24.13.1` 下 `npm run verify` 通过，包含格式、Lint、TypeScript、11 个测试文件 / 187 个测试、生产构建和 TeachingBridge 懒加载检查；Vite 主包体积 warning 仍是已知债务，不是失败。

验收目标：用户从前端第 5 关剧情、教学桥或 Lab 进入时，看到的例子都围绕前端回归验收，不再被第一章保存/数据库示例带偏。

## R328：跨电脑拉取说明更新到最新远端基线

- [x] 核对当前远端：`origin` 为 `https://github.com/xixinikl/code-quest.git`，工作分支为 `cx/ai-career-rpg-home`，远端默认 HEAD 仍指向 `feat/guided-learning-bridge`，因此另一台电脑不能只用 clone 后默认分支继续。
- [x] 核对当前已推送功能基线：`65e3603 fix(rpg): own java release harbor teaching flow` 已在 `origin/cx/ai-career-rpg-home`。
- [x] 更新 `HANDOFF.md`：补清“首次 clone 怎么拉、已有仓库怎么更新、本地有改动怎么保护、拉完怎么比对 hash、怎么继续开发、为什么现在还不建议合并”。
- [x] 明确另一台电脑拉完后必须执行：`git rev-parse HEAD`、`git rev-parse origin/cx/ai-career-rpg-home`、`git ls-remote origin refs/heads/cx/ai-career-rpg-home`、`node -v`、`npm run verify`。
- [x] 本轮工程化检查：`xixi-dev-system profile sync`、`doctor --project .`、`updates --project .` 已执行；doctor 结果为 pass。

验收目标：另一台电脑不用猜“拉哪个分支、是不是完整、能不能直接合并”。按 `HANDOFF.md` 执行后，应显式切到 `cx/ai-career-rpg-home`，看到 `65e3603` 和本次文档提交或更新提交，本地 HEAD 与远端分支 hash 一致，并在 Node `24.13.1` 下完成验证。

## R329：前端第 3 关性能剧情与 Lab 旧保存语境清理

- [x] 浏览器从 `#chapter-frontend-3` 发现第一幕线索仍写“保存后刷新慢”，会把用户带回第一章保存链路；已改为首屏白屏久、点击筛选慢、列表出现慢、滚动卡顿等前端性能现象。
- [x] 剧情证据补强：接口时钟塔线索加入 `Server-Timing: db;dur=1450`，性能回归试炼场线索加入 `X-Cache: MISS/HIT`，让用户知道性能排查具体看哪份证据。
- [x] `ResponseForm` 新增 `frontend-performance-proof` 专属新手先读卡和证据表达示范卡，不再掉回第一章 `response.ok / 数据库写入 / 保存链路` 默认模板；示范改为 Network 瀑布图、TTFB、Server-Timing、X-Cache、后端日志和 render profile。
- [x] 加严 `src/App.test.tsx`：前端第 3 关剧情必须包含 TTFB、Server-Timing、X-Cache，并禁止保存后刷新、`response.ok 后显示 saved`、数据库写入和保存链路旧词；岗位 Lab 默认渲染也禁止这些旧词。
- [x] 定向验证通过：`npm run test -- src/App.test.tsx --run -t "前端第 3|岗位 Lab 默认"`，2 个测试通过。
- [x] 快速门禁通过：Node `v24.13.1` 下 `npm run verify:quick`，11 个测试文件 / 189 个测试通过。
- [x] 浏览器验收：隔离 API `4405`、临时 SQLite `/tmp/code-quest-r329.sqlite`、Vite `5255`；`#chapter-frontend-3` 从封面进入剧情，完成首屏计时港与浏览器瀑布观测台两幕，桌面 `scrollWidth = clientWidth = 1200`，暗色背景 `rgb(7, 12, 20)`，控制台 error 为 0。当前 DOM 中 `保存后刷新慢`、`response.ok 后显示 saved`、`数据库真的写入`、`保存后刷新数据消失`、`保存链路` 均为 false。

验收目标：前端第 3 关不再用第一章保存/数据库例子解释性能问题；用户看到的是完整的性能排查语言：体感现象 → Network 瀑布图 → TTFB/Server-Timing → 渲染画像 → X-Cache 与复测。
