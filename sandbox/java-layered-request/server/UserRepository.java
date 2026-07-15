package com.codequest.users;

public interface UserRepository {
    User findById(String userId);
}
