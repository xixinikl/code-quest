# 码上冒险交接文档 2026-07-09

## 当前分支与仓库

- 本地分支：`cx/ai-career-rpg-home`
- 远端仓库：`origin` -> `https://github.com/2082743849-beep/code-quest.git`
- 冻结基线：`d21721e`
- 本轮上传目标：把当前 AI 职业 RPG 学习路线开发内容推送到 `origin/cx/ai-career-rpg-home`
- 旧远端分支：`origin/feat/guided-learning-bridge` 仍停在 `daa8fc7`

## 已完成范围

- 首页从旧学习工具改为暗色神秘 RPG 序章：开场、剧情选择、任务简报、岗位路线选择。
- AI 应用开发路线扩展为 15 章，从数据保存、产品 Brief、登录态、接口、数据一致性、性能、AI API、幻觉控制、RAG、Agent 工具、测试、Agent 任务、交付审查、上线检查到面试表达。
- 每章都有路线 manifest、剧情入口、工作背景、流程解释、关键材料、Agent 协作、验收动作和面试复盘。
- 第 1-15 章都已接入独立实战 Lab 和对应 `sandbox/` 种子项目。
- 首页增加伙伴图鉴、伙伴背包、通关奖励、角色/宠物/装备解锁。
- 新增面试复盘册、复盘房间、面试作品集 Markdown 出口。
- 新增本地备份库，可导出/恢复 SQLite 学习记录和成长档案 JSON。
- 旧 V1 localStorage 小课、单选题成长规则、侦探命名、用户可见基线诊断入口已移除。

## 关键文件

- `HANDOFF.md`：新 Agent 必读入口。
- `docs/ai-career-rpg-tasks.md`：当前产品与任务事实源。
- `src/App.tsx`：RPG 首页、任务简报、实战 Lab、复盘房间、作品集、备份库主入口。
- `src/careerRoadmap.ts`：15 章 AI 应用开发路线和多岗位路线骨架。
- `src/careerProfile.ts`：成长身份、XP、通关章节和解锁物。
- `src/TeachingBridge.tsx`：剧情教学桥和代码导读。
- `server/scenarios.ts`：所有沙盒场景、步骤和材料白名单。
- `server/store.ts`：SQLite 学习记录、教学进度、备份导出/导入。
- `server/app.ts`：本地学习 API。
- `sandbox/*`：各章独立练习项目。

## 验证证据

最近一次完整验证：

```bash
npm run verify
```

结果：

- format:check 通过
- lint 通过
- typecheck 通过
- Vitest 6 个测试文件、51 个测试通过
- production build 通过

浏览器验收：

- `http://127.0.0.1:5173/`
- 任务简报 -> 面试作品集：桌面 1280px 和 390px 手机宽度无横向溢出，控制台 0 error / 0 warning。
- 任务简报 -> 本地备份库 -> 生成备份 JSON：桌面 1280px 和 390px 手机宽度无横向溢出，控制台 0 error / 0 warning。

## 安全边界

- Web/API 不导入 `child_process`。
- 应用不执行用户终端命令。
- 服务只监听 `127.0.0.1`。
- 沙盒材料只能通过 `server/scenarios.ts` 白名单读取。
- 不上传真实项目源码或个人信息。
- 能力等级不能只靠 XP、单题、自评或字数晋级。
- 学习效果未经过真人试玩前，不能写成“学习效果通过”。

## 未完成事项

- 真人学习效果验收：需要真实用户完整走主线，记录卡点和理解困难。
- Java 后端路线：已有首页锁定态和 manifest 骨架，尚未做具体章节。
- 前端工程路线：已有首页锁定态和 manifest 骨架，尚未做具体章节。
- 继续提升剧情可玩性：更多场景图片、角色演出、选择反馈和动效可以继续增强。

## 下一位 Agent 建议顺序

1. 先读 `HANDOFF.md`。
2. 再读 `docs/ai-career-rpg-tasks.md`。
3. 运行 `npm run verify`，确认本地状态。
4. 用浏览器从首页走一遍任务简报、章节卷宗、作品集和备份库。
5. 不要直接改 `main`；继续在 `cx/` 分支上工作。
