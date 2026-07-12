# 码上冒险

## 仓库身份

| 项目 | 说明 |
|---|---|
| 类型 | 产品仓库：面向初学者的证据式开发学习应用。 |
| 协作关系 | 由 `xixi-dev-system` 接入；质量报告供 `quality-hub` 读取；个人偏好来自 `xixi-agent-profile`。 |
| 平时需要打开吗 | 开发或学习时打开；只看整体状态时打开 Quality Hub。 |
| 当前状态 | 使用中，当前开发基线是 `feat/guided-learning-bridge`。 |
| 新电脑恢复 | `git clone` 后运行 `npm install`，再运行 `~/.codex/bin/xixi-dev-system doctor --project .` 和 `npm run verify`。 |

本产品的界面只遵守本仓库自己的设计和学习体验要求，不复用其他产品的配色与版式。

一个为“用 Agent 做项目、同时想真正学会开发”的初学者设计的本地证据式学习应用。

它不再用明显的单选题判断水平。首个真实场景要求用户阅读独立项目代码、Network、日志和 SQLite 证据，在自己的编辑器中修复故障，并手动运行测试。

## 启动

要求 Node.js 22.5+。项目使用 Node 内置 SQLite，不需要安装数据库服务器。

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址。学习记录保存在 `.data/code-quest.sqlite`。服务只监听本机，不读取或上传真实项目内容，也不会替用户执行终端命令。

## 首个真实场景

练习项目位于：

```text
sandbox/canvas-save-persistence
```

当应用进入“真实修复与测试”阶段后，在该目录手动运行：

```bash
npm test
```

应用只读取生成的 `test-results.json`；它不会运行这条命令。

## 验证

```bash
npm run verify
```

该命令依次执行格式检查、Lint、TypeScript、测试和生产构建。

## 产品边界

V2 第一纵向切片包含无提示基线、真实项目材料、逐步自由回答、分级提示、独立沙盒、手动测试报告、SQLite 学习记录和透明候选证据。详细标准见 `docs/v2-learning-contract.md`。

## 后续开发交接

当前 `main` 作为冻结审查基线。下一阶段“引导式教学桥梁”的开发入口、分支规则和阅读顺序见 `HANDOFF.md`；需求与任务分别见 `docs/guided-learning-spec.md` 和 `docs/guided-learning-tasks.md`。
