# V2 API 与数据契约

## 安全不变量

1. 服务只监听 `127.0.0.1`。
2. API 不接受、拼接或执行命令。
3. 场景 ID 必须来自服务端白名单，不能转换为任意文件路径。
4. 测试报告路径由场景注册表固定给出，并在读取前验证仍位于项目 `sandbox/` 内。
5. 原始作答以纯文本或 JSON 保存，不被解释为代码。
6. V1 的 XP 不能转换成能力证据。

## 数据表

### learner_profiles

- `id`：本地学习者固定 ID。
- `created_at`、`updated_at`。

### diagnostic_sessions

- `id`、`learner_id`、`status`。
- `started_at`、`completed_at`。
- `baseline_json`：用户在无提示阶段的原始回答。

### attempts

- `id`、`learner_id`、`scenario_id`、`status`。
- `started_at`、`submitted_at`。
- `hint_level`：0 表示未使用提示，1～3 表示逐级提示。
- `verification_status`：未运行、失败、通过、报告无效。

### step_responses

- `attempt_id`、`step_id` 组成唯一键。
- `response_json`：原始回答。
- `saved_at`。

### verification_events

- `attempt_id`、`status`、`report_json`、`observed_at`。
- 每次读取报告都追加记录，保留失败到成功的过程。

### evidence_records

- `attempt_id`、`skill_id`、`evidence_type`。
- `level_candidate`：只表示候选证据，不直接修改技能等级。
- `reason_json`：公开说明该证据为什么成立或不足。
- `created_at`。

## API

### `GET /api/health`

返回数据库连接状态、schema 版本和安全模式，不返回绝对路径。

### `POST /api/diagnostic-sessions`

创建或恢复当前未完成诊断。

### `PATCH /api/diagnostic-sessions/:id`

保存无提示基线回答。请求体只允许契约字段。

### `POST /api/attempts`

请求体：`scenarioId`。只接受注册场景。

### `GET /api/attempts/:id`

返回尝试、逐步回答、提示与验证历史。

### `PATCH /api/attempts/:id/steps/:stepId`

保存一个步骤的原始回答。步骤 ID 必须属于该场景。

### `POST /api/attempts/:id/hints`

按顺序领取下一层提示并记录，不允许跳级或回退记录。

### `POST /api/attempts/:id/verify`

读取场景注册表中的固定报告路径，校验报告格式、场景 ID 和时间，不运行测试。

### `POST /api/attempts/:id/submit`

根据测试报告、提示层级和 rubric 生成透明的候选证据。缺少解释或变式复测时，不能产生 L3 证据。

### `GET /api/evidence`

返回原始证据和评分理由，不把 XP 当作技能等级。

## 迁移与备份

- 数据库位于 `.data/code-quest.sqlite`，由 `.gitignore` 排除。
- 迁移记录写入 `schema_migrations`，每个版本只执行一次。
- 每次 schema 变化都必须有从空库创建和从前一版本升级的测试。
- 数据导出功能在 T11 实现前，数据库文件是唯一事实源，不声称具备完整备份能力。
