# 跨电脑接手说明

更新时间：2026-07-16

## 现在拉哪个分支

当前完整阶段成果已经上传到：

- 仓库：`https://github.com/2082743849-beep/code-quest.git`
- 远端提示新地址：`https://github.com/xixinikl/code-quest.git`
- 分支：`cx/ai-career-rpg-home`
- R286 前远端最新提交：`c3a9ed3 docs: add cross-computer handoff`
- 功能大提交：`09c3228 feat(rpg): expand guided career adventure`
- 本文件已记录 R286「第 2 章产品链路实战场景导演层」；接手时以 `git status --short --branch` 和 `git ls-remote origin refs/heads/cx/ai-career-rpg-home` 确认最新远端 hash。

不要从 `main` 接着做这版 RPG 教学体验；`main` 仍是冻结审查基线。

## 另一台电脑从零拉取

```bash
git clone https://github.com/2082743849-beep/code-quest.git
cd code-quest
git checkout cx/ai-career-rpg-home
npm install
npm run verify
npm run dev
```

如果旧地址提示仓库迁移，也可以直接使用新地址：

```bash
git clone https://github.com/xixinikl/code-quest.git
cd code-quest
git checkout cx/ai-career-rpg-home
npm install
npm run verify
npm run dev
```

本分支固定 Node 版本在 `.nvmrc`：`24.13.1`。如果另一台电脑有 `nvm`：

```bash
nvm install
nvm use
```

## 已确认上传完整性

本机确认结果：

- `git status --short --branch`：提交推送完成后应为干净，并显示 `cx/ai-career-rpg-home...origin/cx/ai-career-rpg-home`。
- `git ls-remote origin refs/heads/cx/ai-career-rpg-home`：R286 前远端为 `c3a9ed3e4c7d8782cbd3d99715e30e3e0c9f43cc`；若已包含 R286，远端 hash 会更新。
- 远端分支包含 `HANDOFF.md`、`docs/cx-ai-career-rpg-home-merge-notes.md`、本文件、`src/assets/*.webp`、`sandbox/**`、`src/TransferRetestLab.tsx`、`src/chapterCinematics.ts`、`src/transferRetests.ts`、`scripts/verify-lazy-chunks.mjs`
- R286 前收口 `npm run verify` 已通过：格式、Lint、类型、10 个测试文件 / 170 个测试、生产构建和 TeachingBridge 懒加载检查。
- R286 本地补丁已通过：`npm run test -- src/App.test.tsx --run`（46 个测试）和 `npm run verify:quick`（10 个测试文件 / 170 个测试）。

## 我已经做了什么

- 把普通学习工具推进成暗色 RPG 教学路线：序章、职业档案、章节剧情、角色立绘、伙伴/宠物、地图、运镜、成长等级。
- AI 应用开发路线扩展到 15 章，覆盖保存链路、产品 Brief、登录态、接口错误、数据一致性、性能、AI API、幻觉控制、RAG、Agent 工具、测试验收、Agent 委托、交付审查、上线、面试表达。
- Java 后端和前端工程路线各接入 5 章骨架和岗位切换入口。
- 第一章教学和实战重点打磨：流程接力、名词解释、关键代码翻译、作答支架、证据表达示范、保存回执、逐步骤地点/角色/背景切换。
- 第二章 CanvasStorm 产品链路实战开始补齐逐步场景导演层：Brief 星图、方向筛选、会话账本、委托锻造、交付审查和面试讲述会切换不同地点、角色、背景、目标和收获。
- 新增一批真实沙盒练习与复测材料，放在 `sandbox/`，用于训练用户读证据、写 Agent 任务、验收交付和迁移复盘。
- 将旧大 PNG 场景替换为 WebP，保留统一暗色幻想风格并减少资源体积。
- 增加 `TransferRetestLab`、章节运镜事实源、教学补课、迁移复测事实源、懒加载检查脚本等工程结构。
- 更新 `HANDOFF.md`、`docs/ai-career-rpg-tasks.md`、`docs/cx-ai-career-rpg-home-merge-notes.md` 和 changelog 片段。

## 当前完成情况

整体项目不是最终完成版，按产品完整度估计约 62%。

当前分支作为阶段成果可以继续开发和验收，已经具备：

- 统一暗色 RPG 基础体验
- 15 章 AI 主线骨架与大量章节内容
- Java/前端岗位路线入口
- 第一章较完整的新手教学与实战理解链
- 第二章实战已经开始接上产品链路剧情，但细致程度仍需继续向第一章靠齐
- 沙盒与迁移复测材料
- 自动化测试和构建门禁

仍未声称完成：

- 真人学习效果验证
- 所有章节达到第一章同等细致程度
- 用户手动修复沙盒、运行测试、读取通过报告的完整真实闭环
- Java/前端路线后续章节的完整教学深挖
- PR 审查和合并到 `main`

## 下一步怎么做

建议顺序：

1. 在另一台电脑拉 `cx/ai-career-rpg-home`，先跑 `npm run verify`。
2. 打开 `npm run dev`，重点试玩：序章、职业档案、第一章教学、第一章实战、保存后下一地点切换。
3. 接着试玩第二章 CanvasStorm 实战：确认 Brief 星图到方向筛选的场景切换、名词解释和作答支架是否让新手看得懂。
4. 先修最影响体验的问题：看不懂、风格断层、移动端一屏读不完、角色/背景不统一。
5. 不要继续盲目堆新功能；优先把第一章体验模式复制到更多关键章节。
6. 合并前开 PR 审查，不要直接 merge `main`。

## 是否现在合并

不建议现在直接合并到 `main`。

原因：

- 改动量很大，直接 merge 后回滚成本高。
- 这是阶段成果，不是最终学习效果已证明。
- 仍需要用户视觉确认、关键路径浏览器抽检和 PR 审查；每次提交后先确认远端 hash，再让另一台电脑拉取。

推荐做法：

- 继续在 `cx/ai-career-rpg-home` 开发和验收。
- 满意后开 PR。
- PR 通过后再合并 `main`。

## 接手时先读哪些文件

1. `HANDOFF.md`
2. `docs/cross-computer-handoff.md`
3. `docs/cx-ai-career-rpg-home-merge-notes.md`
4. `docs/ai-career-rpg-tasks.md`
5. `AGENTS.md`

## 常用命令

```bash
git status --short --branch
npm run verify
npm run dev
```

如需确认远端是否完整：

```bash
git ls-remote origin refs/heads/cx/ai-career-rpg-home
git log --oneline -3 --decorate
```
