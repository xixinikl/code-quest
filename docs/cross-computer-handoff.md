# 跨电脑接手说明

更新时间：2026-07-16

## 当前结论

当前本机代码已经完整推送到 GitHub 的阶段分支：

- 仓库：`https://github.com/xixinikl/code-quest.git`
- 分支：`cx/ai-career-rpg-home`
- 当前远端提交：`d77761a8110789af61d72883cbd2191948b32fb9`
- 提交标题：`feat(rpg): anchor code tour lines to evidence`
- 本地状态：`cx/ai-career-rpg-home...origin/cx/ai-career-rpg-home`，工作区干净时表示没有漏推补丁。

不要从 `main` 继续做这版 RPG 教学体验；`main` 仍是冻结审查基线。当前分支可以拉到另一台电脑继续开发，但不建议现在直接合并到 `main`。

## 另一台电脑从零拉取

```bash
git clone https://github.com/xixinikl/code-quest.git
cd code-quest
git checkout cx/ai-career-rpg-home
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
- 最近提交包含 `d77761a feat(rpg): anchor code tour lines to evidence`
- `git ls-remote` 返回 `d77761a8110789af61d72883cbd2191948b32fb9`
- `git status --short --branch` 没有未提交文件

如果另一台电脑显示的远端 hash 不是 `d77761a...`，先执行：

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
- 新增一批真实沙盒练习与复测材料，放在 `sandbox/`，用于训练用户读证据、写 Agent 任务、验收交付和迁移复盘。
- 将旧大 PNG 场景替换为 WebP，保留统一暗色幻想风格并减少资源体积。
- 更新 `HANDOFF.md`、`docs/ai-career-rpg-tasks.md`、`docs/cx-ai-career-rpg-home-merge-notes.md` 和 changelog 片段。

## 当前验证证据

最新提交 `d77761a` 前后已记录的验证：

- `npm run test -- src/App.test.tsx --run` 通过：1 个测试文件 / 46 个测试。
- `npm run verify:quick` 通过：lint、typecheck、10 个测试文件 / 171 个测试。
- 浏览器验收：隔离 API `4352`、临时 SQLite `/tmp/code-quest-r290.sqlite`、Vite `5202`；第 1 章代码导读页桌面和 390px 移动端无横向溢出，控制台 error 为 0。

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
2. 先补第 1 章实战验收页和成长档案的理解闭环：用户要知道测试报告证明什么、不能证明什么、怎么写进面试和 Agent 交付。
3. 再把第 2 章从读 Brief 到测试/交付/面试完整走一遍，继续消除“产品逻辑看不懂”的断层。
4. 然后抽检第 3-5 章，优先修风格断层、术语过密、移动端一屏读不完的问题。
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
