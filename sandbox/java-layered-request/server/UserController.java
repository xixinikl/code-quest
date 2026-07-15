package com.codequest.users;

public final class UserController {
    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    public UserResponse getUser(String userId) {
        // 事故现场：Controller 直接访问数据层，绕过了业务层的权限检查。
        User user = userRepository.findById(userId);
        return UserResponse.from(user);
    }
}
