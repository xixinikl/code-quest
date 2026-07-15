# Agent 交付说明（待审查）

已确认接口返回 200，数据库查询返回 1 行。

尚未证明：

- Controller 是否经过 UserService；
- viewerId 不匹配时是否会被拒绝；
- 其他入口是否仍然共享同一套业务规则。
