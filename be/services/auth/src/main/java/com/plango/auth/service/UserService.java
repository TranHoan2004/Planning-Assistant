package com.plango.auth.service;

import java.util.Optional;

import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.exception.AppException;
import com.plango.auth.model.User;
import com.plango.auth.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    UserRepository userRepository;
    PasswordEncoder encoder;

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findActiveUserByEmail(email);
    }

    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public void updatePassword(String email, String password) {
        var user = getUserByEmail(email).orElseThrow(
                () -> new AppException(ErrorCodes.REG_001)
        );
        user.setPassword(encoder.encode(password));
        userRepository.save(user);
    }
}
