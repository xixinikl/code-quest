# Agent 交付说明

- 已检查登录接口，确认成功返回 accessToken 和 refreshToken Cookie。
- 初步判断是前端没有在刷新请求中携带 Cookie，建议增加 `credentials: "include"`。
- 未检查认证服务重启后的会话仓库，也未提供数据库查询与当前源码测试报告。

风险：当前结论只解释浏览器请求，不足以证明服务端为什么找不到会话。
