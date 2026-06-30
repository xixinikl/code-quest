# 码上冒险 项目规则

## 项目目标

- 目标：通过独立真实项目、原始作答、实际测试和变式复测，帮助初学者建立可解释的开发能力证据。
- 非目标：读取用户真实项目、执行任意终端命令、用 XP 或单题冒充能力、提供云账号、社交或付费能力。

## 项目结构

- `src/`：React 学习界面。
- `server/`：只监听本机的学习记录 API、SQLite 迁移和固定报告读取器。
- `sandbox/`：独立练习项目；由用户手动运行测试，应用不得执行。
- `docs/`：产品范围、架构决策和已知债务。
- `changelogs/`：面向用户的变更片段。
- `scripts/verify.sh`：本地与 CI 共用的完整质量门禁。

## 技术栈

React 19、TypeScript 5、Vite 7、Node HTTP、Node SQLite、Vitest、Testing Library。学习记录事实源是本地 SQLite。

## 标准命令

```bash
npm install
npm run dev
npm run verify:quick
npm run verify
```

## 架构边界

- 场景、步骤和允许读取的材料集中在 `server/scenarios.ts`。
- Web/API 禁止导入 `child_process`，不得接受或执行命令字符串。
- 场景材料与报告只能通过服务端注册表访问，并验证真实路径位于 `sandbox/`。
- 能力等级由证据门槛决定；XP、自评、单题和字数不能直接晋级。
- 不收集、不上传真实项目源码或个人信息；服务仅监听 `127.0.0.1`。

## 完成标准

- 实现与 `docs/spec.md` 的验收标准一致。
- 格式、Lint、类型检查、测试和生产构建通过。
- 从真实浏览器入口走通基线、调查、手动测试报告、提示记录和刷新恢复。
- 学习效果与工程闭环分开描述；未真实复测时不得声称用户已经掌握。
- Diff 不含调试代码、秘密、临时文件或无关修改。

## 版本控制

- Commit：`type(scope): 简明结果`
- 提交、推送、PR 和部署必须获得用户授权。
- 用户可感知变化写入 Changelog fragment。
- PR 必须包含摘要、验证证据、风险和回滚。
- 当前 `main` 是冻结审查基线；后续引导式教学开发必须从 `main` 创建 `feat/guided-learning-bridge`，不得直接修改或合并回 `main`。

## Agent 交接

- 新 Agent 必须先读根目录 `HANDOFF.md`，再按其中顺序读取 Skill、需求、任务和架构文档。
- 引导式教学的事实源是 `docs/guided-learning-spec.md`，执行清单是 `docs/guided-learning-tasks.md`。
- 功能分支完成后必须停下，保留完整验证证据，等待原 Agent 审查。

## 局部规则

当前为单体应用，无局部 `AGENTS.md`。
