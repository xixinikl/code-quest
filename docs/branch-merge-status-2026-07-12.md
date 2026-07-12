# 分支与合并状态记录 2026-07-12

## 结论

当前本地成果已经上传到 GitHub，但不建议现在合并到主线或旧功能分支。

继续开发应优先基于：

```text
cx/ai-career-rpg-home
```

当前分支适合作为“AI 职业 RPG 学习路线”的持续开发分支和备份分支，不是最终可合并版本。

## 当前分支图

```text
origin/feat/guided-learning-bridge
└─ 10132c1 chore: onboard project to Xixi Dev System (#1)

origin/cx/ai-career-rpg-home
└─ 4ee7c51 feat(rpg): add ai career route and backup vault
```

两条分支都从 `daa8fc7 docs: agent handoff document` 后分出。

## 分支说明

| 分支                                 | 当前哈希                                   | 状态                  | 用途                                                      |
| ------------------------------------ | ------------------------------------------ | --------------------- | --------------------------------------------------------- |
| `cx/ai-career-rpg-home`              | `4ee7c51602958182d5f5424e006d85a696bd4291` | 已上传，继续开发      | AI 职业 RPG 首页、15 章路线、沙盒、面试作品集、本地备份库 |
| `origin/feat/guided-learning-bridge` | `10132c1`                                  | 远端比本地多 1 个提交 | 旧引导式教学分支，新增 Xixi Dev System 接入               |
| `main`                               | 冻结审查基线                               | 不直接开发            | 旧规则中的稳定基线                                        |

## 已上传内容

`cx/ai-career-rpg-home` 已经包含：

- `HANDOFF.md`
- `docs/handoff-code-quest-2026-07-09.md`
- `docs/ai-career-rpg-tasks.md`
- `docs/branch-merge-status-2026-07-12.md`
- AI 应用开发 15 章路线
- 第 2-15 章对应 `sandbox/` 种子项目
- RPG 首页、任务简报、剧情教学桥、实战 Lab、面试复盘房间、面试作品集、本地备份库
- 服务端场景注册表、SQLite 学习记录、备份导出/恢复 API
- 对应测试和 changelog fragment

## 不建议现在合并的原因

- 用户明确反馈当前体验还未完全满意，仍要继续优化 UI、剧情代入感和学习逻辑。
- 真人学习效果还没有验收，不能声明“学习效果通过”。
- Java 后端和前端工程路线目前只是锁定态规划，尚未做具体章节。
- `origin/feat/guided-learning-bridge` 已有新提交 `10132c1`，合并前需要先确认这个 Xixi Dev System 接入是否必须保留。
- 当前 `cx/ai-career-rpg-home` 是大改分支，直接合并会把旧 V1 侦探/小课结构替换为 AI 职业 RPG 结构，需要审查后再进主线。

## 后续继续开发建议

1. 不要在 `main` 上直接改。
2. 优先在 `cx/ai-career-rpg-home` 继续做体验优化。
3. 如果要做风险更小的拆分，可以从 `cx/ai-career-rpg-home` 再开新分支，例如：

```text
cx/rpg-story-polish
cx/rpg-ui-consistency
cx/rpg-learning-flow
```

4. 每个后续分支都要在 `HANDOFF.md` 或本文件追加记录：来源分支、目标、提交哈希、是否已推送、是否可合并。

## 合并前必须检查

合并前按顺序做：

```bash
git fetch origin
git status --short
git log --oneline --decorate --graph --max-count=20 --all
npm run verify
```

还要补做真实浏览器验收：

- 首页进入是否有明确故事动机。
- 任务简报是否能看懂主线、章节和职业路线。
- 至少走通 1 个章节：剧情教学 -> 项目材料 -> 实战 Lab -> 复盘。
- 面试作品集可以打开并复制 Markdown。
- 本地备份库可以生成 JSON。
- 390px 手机宽度无横向溢出。

## 合并策略建议

暂不 merge。

等体验完成后，再选择一种策略：

- 如果 `feat/guided-learning-bridge` 的 Xixi Dev System 接入必须保留：先把 `origin/feat/guided-learning-bridge` 合入 `cx/ai-career-rpg-home`，解决冲突并重新验证。
- 如果 `cx/ai-career-rpg-home` 将作为新产品方向：从该分支开 PR，目标分支按当时仓库规则选择，不要绕过审查。

## 最近验证记录

最近一次完整验证使用 Node 24 环境执行：

```bash
npm run verify
```

结果：

- format:check 通过
- lint 通过
- typecheck 通过
- Vitest 6 个测试文件、51 个测试通过
- production build 通过

注意：系统默认 Node 18 会因为 `node:sqlite` 不可用导致测试失败；本项目需要 Node 22.5+，推荐用 Node 24。
