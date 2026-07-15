package com.codequest.users;

public final class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findUser(String userId, String viewerId) {
        if (!viewerId.equals(userId)) {
            throw new IllegalArgumentException("viewer cannot read this user");
        }
        return userRepository.findById(userId);
    }
}
