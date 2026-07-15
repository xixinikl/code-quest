package com.codequest.users;

public record UserResponse(String id, String displayName) {
    static UserResponse from(User user) {
        return new UserResponse(user.id(), user.displayName());
    }
}
