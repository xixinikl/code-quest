# 码上冒险：后续 Agent 交接入口

## 交接目标

当前 `main` 是经过验证的冻结基线。下一位 Agent 只负责在独立功能分支上，为现有第一关增加“引导式教学桥梁”，解决用户进入真实代码后看不懂、无从下手、感觉无聊的问题。

不要直接在 `main` 开发，不要扩充新场景，不要重写已验证的安全沙盒。

## 强制阅读顺序

1. `AGENTS.md`：项目规则、安全不变量和版本控制要求。
2. `/Users/xixi/.codex/skills/standard-project-workflow/SKILL.md`：用户指定的规范项目工作流。
3. `docs/handoff-guided-learning.md`：用户反馈、产品目标和完整交接事实。
4. `docs/guided-learning-spec.md`：引导式教学需求与验收标准。
5. `docs/guided-learning-tasks.md`：实施顺序、停止条件和交付清单。
6. `docs/v2-learning-contract.md`：长期能力证据契约。
7. `docs/v2-architecture-proposal.md` 与 `docs/v2-api-contract.md`：架构和安全边界。
8. `docs/v2-tasks.md`、`docs/decisions.md`、`docs/debt.md`：现状、决策和未完成事项。

## 开始工作前

先确认用户提供的冻结提交哈希与本地 `main` 一致，然后创建独立分支：

```bash
git status --short --branch
git rev-parse main
git switch -c feat/guided-learning-bridge "$(git rev-parse main)"
```

如果工作区不干净、`main` 与用户给出的冻结哈希不同，或分支已存在且来源不明，停止并向用户报告，不要 reset、覆盖或清理别人的改动。

## 冻结规则

- `main` 只作为审查基线，不在其上继续提交。
- 后续开发分支固定命名为 `feat/guided-learning-bridge`。
- 不合并、不推送、不建 PR，除非用户另行明确授权。
- 不修改 CanvasStorm 或工作区以外的任何项目。
- 不删除 V1/V2 历史文档；新决策以追加或明确替代状态记录。
- 不降低现有 17 项自动化测试、安全路径校验或本地监听限制。

## 当前可验证基线

- React + TypeScript + Vite 前端。
- Node 本地 API，仅监听 `127.0.0.1`。
- Node SQLite 保存诊断、尝试、提示、测试与证据。
- 独立练习项目位于 `sandbox/canvas-save-persistence/`。
- Web/API 不执行 shell；用户手动运行沙盒 `npm test`。
- 报告必须来自固定路径、晚于当前练习，并与当前源码 SHA-256 指纹一致。
- `npm run verify` 当前应通过 5 个测试文件、17 项测试和生产构建。
- 学习效果尚未通过真人验收，禁止描述为“已经教会用户”。

## 本次唯一产品重点

把当前流程：

```text
无提示基线 → 直接阅读真实代码 → 修复与测试
```

改为：

```text
无提示基线
→ 项目地图
→ 当前任务所需微知识
→ 一次只看少量关键代码
→ 带着预测和解释阅读
→ 教学模式共同完成一步
→ 陪练模式逐渐撤掉提示
→ 独立实战
→ 复盘与后续迁移
```

教学模式的帮助不能计入“提示等级”；陪练与实战的提示才作为能力证据依赖程度记录。

## 交付给审查 Agent 的材料

完成开发后停在功能分支，至少提供：

- 功能分支名和 HEAD 哈希；
- 相对冻结 `main` 的 `git diff --stat`；
- 实际运行的验证命令及输出摘要；
- 真实浏览器主流程和负面路径证据；
- 数据库迁移与回滚说明；
- 安全边界是否变化；
- 已知边界和未完成任务；
- 用户需要亲自试玩的具体步骤。

不要自行合并回 `main`。等待原 Agent 恢复后审查。
