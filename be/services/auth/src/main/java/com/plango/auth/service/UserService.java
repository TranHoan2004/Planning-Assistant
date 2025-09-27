package com.plango.auth.service;

import java.util.Optional;

import com.plango.auth.model.User;
import com.plango.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findActiveUserByEmail(email);
    }
}
