# 练习项目：请求为什么要经过三层

这是一个独立的 Java 分层阅读练习。你要沿着“查看用户资料”的请求，判断 Controller、Service 和 Repository 各自应该负责什么。

## 事故现场

接口返回了用户资料，表面上功能可用；但 Controller 直接访问 Repository，绕过了 Service 的权限和业务校验。后续业务规则一改，接口和其他入口就会产生不同结果。

## 学习材料

- `server/UserController.java`：请求入口，含待定位的越层调用。
- `server/UserService.java`：权限与业务规则应该集中在这里。
- `server/UserRepository.java`：只负责查询数据。
- `server/UserResponse.java`：对外返回的数据合同。
- `evidence/`：请求、日志和数据库查询证据。

## 手动运行测试

应用不会替你运行命令。进入本目录后，由你亲自运行：

```bash
npm test
```

测试只读取固定 Java 文件并生成 `test-results.json`，不会编译或执行任意 Java 代码，也不会访问其他项目。

## 你的任务

1. 先用材料画出请求接力：Controller → Service → Repository → 数据库。
2. 找出 Controller 绕过 Service 的证据。
3. 修复调用边界，再运行测试验证。
4. 说明每层不应该承担什么职责。
