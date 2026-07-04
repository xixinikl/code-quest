# 码上冒险：后续 Agent 交接入口

## 当前状态

`feat/guided-learning-bridge` 分支，基于冻结 `main` (`d21721e`) 开发。

**已完成：**
- 引导式教学桥（项目地图 → 4概念卡 → 代码导读 → 共同示范 → 陪练清单）
- 两个案件：Case 001（保存消失）、Case 002（登录消失）
- 侦探身份系统（见习→初级→资深→大神探，XP升级）
- 词库面板（15个术语，浮动按钮）
- 游戏化封面（Linear 深色设计语言）
- 基线自动跳过
- `npm run verify` 17项测试全通过

**未完成：**
- Case 003+ 后续案件
- 登录页面在 app 里实际解锁 Case 002 的逻辑
- 真人学习效果验收
- 数据导出/备份

## 强制阅读顺序

1. `AGENTS.md` — 项目规则、安全不变量
2. `docs/guided-learning-spec.md` — 引导式教学需求
3. `docs/guided-learning-tasks.md` — 实施任务清单
4. `docs/handoff-guided-learning.md` — 用户反馈与产品目标
5. `docs/v2-architecture-proposal.md` — 架构与安全边界

## 技术栈

React 19 + TypeScript 5 + Vite 7 · Node HTTP API · Node SQLite (schema v2) · Vitest

## 关键文件

| 文件 | 说明 |
|---|---|
| `src/App.tsx` | 主入口：游戏封面→教学桥→实战Lab |
| `src/TeachingBridge.tsx` | 教学桥组件（地图/概念/代码/补课/示范/陪练） |
| `src/teaching.ts` | 第一关+第二关全部教学数据 |
| `src/detective.ts` | 侦探身份/XP系统 |
| `server/db.ts` | schema v2 `teaching_progress` 表 |
| `server/store.ts` | 教学进度保存/读取/重置 |
| `server/app.ts` | 教学API端点 |
| `server/scenarios.ts` | 场景注册表 |
| `src/styles.css` | 全部样式（教学桥+封面在末尾） |

## 标准命令

```bash
npm install
npm run dev        # 启动前后端
npm run verify     # 全量质量门禁（format+lint+type+test+build）
npm run verify:quick  # 快速检查
```

## 安全边界（禁止修改）

- Web/API 不导入 child_process，不执行 shell
- 服务只监听 127.0.0.1
- 沙盒路径固定校验
- localStorage 只存 UI 偏好，能力证据在 SQLite

## 分支规则

- `main` 是冻结审查基线，不在其上开发
- 开发在 `feat/guided-learning-bridge` 或新功能分支
- 不合并、不推送 PR 除非用户明确授权
- Handoff 规则：新 Agent 必须先读本文件

## Git 信息

- 冻结基线：`d21721e510a0c2572c343db09c0f2e3daab9b945`
- 开发分支：`feat/guided-learning-bridge`
- HEAD 哈希：见 `git rev-parse HEAD`
