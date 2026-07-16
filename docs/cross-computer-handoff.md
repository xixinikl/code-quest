# 跨电脑接手说明

更新时间：2026-07-16

## 当前结论

当前本机代码已经完整推送到 GitHub 的阶段分支：

- 仓库：`https://github.com/xixinikl/code-quest.git`
- 分支：`cx/ai-career-rpg-home`
- 当前功能基线：`a0774d3 fix(rpg): clarify lab closeout flow`，本轮会追加 `fix(rpg): classify case two verification clues`。
- 当前交接刷新：应包含本次第 2 章红灯报告分类校准与交接说明更新。
- 当前远端最新提交：本次提交前检查为 `a0774d3c07a575210b89bbfd62f0c217e35eaa2a`；本轮提交推送后会产生新 hash，最终以 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 输出为准。
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
- 最近提交包含本次 `fix(rpg): classify case two verification clues`，或至少包含 `a0774d3 fix(rpg): clarify lab closeout flow`
- 最近提交列表里还能看到 `f16ec5c feat(rpg): explain verification reports`、`dca300e fix(rpg): target persistence verification clues` 和 `a0774d3 fix(rpg): clarify lab closeout flow`
- `git ls-remote` 返回的 hash 与本机或接手文档里最后一次记录的远端 hash 一致
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
- 新增一批真实沙盒练习与复测材料，放在 `sandbox/`，用于训练用户读证据、写 Agent 任务、验收交付和迁移复盘。
- 将旧大 PNG 场景替换为 WebP，保留统一暗色幻想风格并减少资源体积。
- 更新 `HANDOFF.md`、`docs/ai-career-rpg-tasks.md`、`docs/cx-ai-career-rpg-home-merge-notes.md` 和 changelog 片段。

## 当前验证证据

最新一轮已记录的验证：

- `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 47 个测试。
- `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 172 个测试。
- 浏览器验收：隔离 API `4362`、临时 SQLite `/tmp/code-quest-r297.sqlite`、Vite `5212`；第 2 章实战验收页桌面和 390px 移动端无横向溢出，控制台 error 为 0，失败报告显示「红灯总指挥」「第 1 棒 / 第 2 棒 / 第 3 棒」「交给 Agent 的口令」，且不是无效报告状态。

合并 PR 前仍建议重新跑完整：

```bash
npm run verify
```

## 当前完成情况

这是阶段成果，不是最终完成版。按产品完整度估计约 65%。

已经具备：

- 统一暗色 RPG 基础体验
- 15 章 AI 主线骨架与大量章节内容
- Java/前端岗位路线入口
- 第一章较完整的新手教学与实战理解链
- 第二章产品链路实战已明显向第一章体验靠齐
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
2. 继续把第 2 章从读 Brief 到测试/交付/面试完整走一遍，优先补“为什么看这份材料、谁交给谁、错了回哪一棒”的解释。
3. 再抽检第 3-5 章，优先修风格断层、术语过密、移动端一屏读不完的问题。
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
