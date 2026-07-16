# 跨电脑接手说明

更新时间：2026-07-16

## 当前结论

当前本机代码已经完整推送到 GitHub 的阶段分支：

- 仓库：`https://github.com/xixinikl/code-quest.git`
- 分支：`cx/ai-career-rpg-home`
- 当前功能基线：`1a40fe4 feat(rpg): guide case one backhalf evidence bridge`。
- 当前交接刷新：应包含第 1 章实战后半段证据桥、第 3/4/5 章实战导演层、合并前完整门禁和跨电脑拉取说明。
- 当前远端最新提交：至少包含 `9171ac8 docs(rpg): refresh merge readiness handoff` 这份交接刷新；最终 hash 以 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 输出为准，不在文档里硬编码。
- 远端默认 HEAD：当前指向 `feat/guided-learning-bridge`，不是这条 RPG 分支。另一台电脑必须显式 checkout `cx/ai-career-rpg-home`。
- 本地状态：`cx/ai-career-rpg-home...origin/cx/ai-career-rpg-home`，工作区干净时表示没有漏推补丁。

不要从 `main` 继续做这版 RPG 教学体验；`main` 仍是冻结审查基线。当前分支可以拉到另一台电脑继续开发，但不建议现在直接合并到 `main`。

## 另一台电脑从零拉取

```bash
git clone https://github.com/xixinikl/code-quest.git
cd code-quest
git fetch origin
git checkout -B cx/ai-career-rpg-home origin/cx/ai-career-rpg-home
nvm install
nvm use
npm install
npm run verify
npm run dev
```

如果另一台电脑没有 `nvm`，请至少确认 Node 版本与 `.nvmrc` 一致：

```bash
node -v
cat .nvmrc
```

当前项目使用 Node `24.13.1`。

## 确认有没有拉完整

在另一台电脑运行：

```bash
git status --short --branch
git log --oneline -5 --decorate
git ls-remote origin refs/heads/cx/ai-career-rpg-home
```

期望看到：

- 当前分支是 `cx/ai-career-rpg-home`
- 最近提交包含 `9171ac8 docs(rpg): refresh merge readiness handoff`，并紧跟功能基线 `1a40fe4 feat(rpg): guide case one backhalf evidence bridge`
- 最近提交列表里还能看到 `e10069f feat(rpg): guide case five lab scenes`、`2dd44d3 feat(rpg): guide case four lab scenes` 和 `be60ed5 feat(rpg): guide case three lab scenes`
- `git ls-remote` 返回的 hash 与本机 `git rev-parse origin/cx/ai-career-rpg-home` 一致
- `git status --short --branch` 没有未提交文件

如果另一台电脑显示的远端 hash 和当前记录不一致，先执行：

```bash
git fetch origin
git checkout cx/ai-career-rpg-home
git pull --ff-only
```

## 我已经做了什么

- 把普通学习工具推进成暗色 RPG 教学路线：序章、职业档案、章节剧情、角色立绘、伙伴/宠物、地图、运镜、成长等级。
- AI 应用开发路线扩展到 15 章，覆盖保存链路、产品 Brief、登录态、接口错误、数据一致性、性能、AI API、幻觉控制、RAG、Agent 工具、测试验收、Agent 委托、交付审查、上线、面试表达。
- Java 后端和前端工程路线各接入 5 章骨架和岗位切换入口。
- 第一章教学和实战重点打磨：流程接力、名词解释、关键代码翻译、作答支架、证据表达示范、保存回执、逐步骤地点/角色/背景切换。
- 第二章 CanvasStorm 产品链路实战已补齐产品链路剧情、步骤场景、专属解释，并修复串到 AI API 安全章的问题。
- 教学桥后半段持续暗色 RPG 收口，补了概念卡、预测题、解释框、流程节点等关键控件的风格一致性。
- 代码导读增加“当前行证据锚点”，每行说明为什么看、能证明什么、下一步找哪份证据；第 1 章 `response.ok` 明确提示不能证明数据库已经写入。
- 第 1 章验收报告增加「验收证据桥」；保存失败时会把红灯解释为数据层写库断点，并提示回到 repository `saveCanvas` 找 `INSERT` 和刷新查询证据。
- 第 2 章 CanvasStorm 失败报告已校准三类红灯：方向筛选、会话保存、空目标输入会分别指向不同断点，并新增「红灯总指挥」把多个红灯整理成排查顺序和 Agent 口令。
- 第 2 章后半段新增「本步交付口令」：Agent 委托显示背景/边界/验收，交付审查显示已证明/未证明/决定，面试复盘显示场景/行动/结果。
- 第 3 章登录态、第 4 章接口错误、第 5 章数据一致性实战已补齐场景、角色、任务卷轴和流程接力，不再退回普通表单体验。
- 第 1 章实战后半段已补齐沙盒验收、Agent 委托、交付审查、因果解释和面试迁移的证据交接，强调页面绿灯、接口 201、数据库写入和刷新读回是四种不同证据。
- 新增一批真实沙盒练习与复测材料，放在 `sandbox/`，用于训练用户读证据、写 Agent 任务、验收交付和迁移复盘。
- 将旧大 PNG 场景替换为 WebP，保留统一暗色幻想风格并减少资源体积。
- 更新 `HANDOFF.md`、`docs/ai-career-rpg-tasks.md`、`docs/cx-ai-career-rpg-home-merge-notes.md` 和 changelog 片段。

## 当前验证证据

最新一轮已记录的验证：

- `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 51 个测试。
- `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 176 个测试。
- `npm run verify` 通过：格式、Lint、TypeScript、10 个测试文件 / 176 个测试、生产构建和 TeachingBridge 懒加载检查；Vite 主包体积 warning 是已知债务，不是失败。
- 浏览器验收：隔离 API `4369`、临时 SQLite `/tmp/code-quest-r303.sqlite`、Vite `5219`；第 1 章完整剧情探索到实战 Lab，桌面和 390px 移动端无横向溢出，控制台 error 为 0。
- 合并前追加抽检：隔离 API `4370`、临时 SQLite `/tmp/code-quest-r304.sqlite`、Vite `5220`；桌面 1280 与 390px 下序章、证据选择、领取委托、三路线大厅均无横向溢出，控制台 error 为 0。

合并 PR 前仍建议重新跑完整：

```bash
npm run verify
```

## 当前完成情况

这是阶段成果，不是最终完成版。按产品完整度估计约 70%。

已经具备：

- 统一暗色 RPG 基础体验
- 15 章 AI 主线骨架与大量章节内容
- Java/前端岗位路线入口
- 第一章较完整的新手教学与实战理解链
- 第二章产品链路实战已明显向第一章体验靠齐
- 第三到第五章实战已有导演层和证据链讲解，不再是普通题目列表
- 第一章测试报告已经能把红灯翻译成“能证明什么 / 不能证明什么 / 下一步怎么交给 Agent”
- 沙盒、迁移复测材料、自动化测试和构建门禁

仍未完成或不能夸大：

- 真人学习效果验证
- 所有章节达到第一章同等细致程度
- 用户手动修复沙盒、运行测试、读取通过报告的完整真实闭环
- Java/前端路线第 2-5 章的完整深挖
- 全站逐页视觉终审
- PR 审查和合并到 `main`

## 接下来怎么干

建议下一轮按这个顺序继续：

1. 先在 `cx/ai-career-rpg-home` 继续，不要另起太多分支；如果必须开分支，用 `cx/` 前缀并在 `HANDOFF.md` 记录来源和目标。
2. 回看第 1 章和第 5 章真人阅读负担，优先修术语过密、解释不够像故事、移动端一屏读不完的问题。
3. 补齐 Java/前端第 2-5 章逐章浏览器抽检，确认岗位路线不会回退到 AI 章节或旧白底界面。
4. 之后做一次全站关键路径视觉终审：序章、路线大厅、教学桥、实战 Lab、结算、作品集和本地备份。
5. 最后再考虑 PR；PR 前必须重新跑 `npm run verify`，并做桌面与 390px 浏览器关键路径验收。

## 是否现在合并

不建议现在直接合并到 `main`。

原因：

- 改动量很大，直接 merge 后回滚成本高。
- 当前是阶段成果，不是真人学习效果已证明。
- 仍需要用户视觉确认、关键路径浏览器抽检和 PR 审查。

推荐做法：

- 另一台电脑直接拉 `cx/ai-career-rpg-home` 继续开发。
- 满意后开 PR。
- PR 通过后再合并 `main`。

## 接手时先读哪些文件

1. `HANDOFF.md`
2. `docs/cross-computer-handoff.md`
3. `docs/cx-ai-career-rpg-home-merge-notes.md`
4. `docs/ai-career-rpg-tasks.md`
5. `AGENTS.md`
