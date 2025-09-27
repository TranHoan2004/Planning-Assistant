package com.plango.auth.service;

import java.util.Optional;

import com.plango.auth.common.code.TokenType;
import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.dto.request.LoginRequest;
import com.plango.auth.dto.request.RefreshTokenRequest;
import com.plango.auth.dto.request.RegisterRequest;
import com.plango.auth.dto.response.LoginResponse;
import com.plango.auth.dto.response.RegisterResponse;
import com.plango.auth.exception.AppException;
import com.plango.auth.mapper.UserMapper;
import com.plango.auth.model.Token;
import com.plango.auth.model.User;
import com.plango.auth.repository.TokenRepository;
import com.plango.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.plango.auth.common.utils.LogWrapper;


@Service
public class AuthService {

    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Autowired
    private UserJWTService userJWTService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository repository;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new AppException(ErrorCodes.COM_004, "Email must not be null or empty");
        }

        User activeUser = userService.getUserByEmail(request.getEmail()).orElse(null);
        if (activeUser != null) {
            throw new AppException(ErrorCodes.REG_001, "Email already exists");
        }

        User user = userMapper.toEntity(request);
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            LogWrapper.error("User entity email is null or empty after mapping. Request email: " + request.getEmail(),
                    null);
            throw new AppException(ErrorCodes.COM_004, "User entity email must not be null or empty");
        }
        user.setDeleteFlag(false);

        User savedUser = repository.save(user);

        return userMapper.toRegisterResponseDto(savedUser);
    }

    public LoginResponse authenticate(LoginRequest request) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword());

        try {
            authenticationProvider.authenticate(token);
        } catch (Exception e) {
            LogWrapper.warn("Invalid credentials", e.getMessage());
            throw new AppException(ErrorCodes.AUT_001);
        }

        Optional<User> userOptional = userService.getUserByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            LogWrapper.warn("User not found", request.getEmail());
            throw new AppException(ErrorCodes.AUT_002);
        }

        User user = userOptional.get();

        String accessToken = userJWTService.generateToken(user);
        String refreshToken = userJWTService.generateRefreshToken(user);

        saveUserToken(user, accessToken);

        LoginResponse response = userMapper.toLoginResponseDto(user);
        response.setAccessToken(accessToken);
        response.setAccessTokenExpiresIn(userJWTService.getExpiration());
        response.setRefreshToken(refreshToken);
        response.setRefreshTokenExpiresIn(userJWTService.getRefreshExpiration());
        return response;
    }

    public void saveUserToken(User user, String jwtToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    public LoginResponse refreshToken(RefreshTokenRequest request) {

        final String refreshToken = request.getRefreshToken();
        final String userEmail;
        try{
            userEmail= userJWTService.extractUsername(refreshToken);
        } catch (Exception e) {
            throw new AppException(ErrorCodes.AUT_002);
        }

        if (userEmail == null) {
            LogWrapper.warn("Unauthenticated request: invalid refresh token");
            throw new AppException(ErrorCodes.AUT_002);
        }

        User user = userService.getUserByEmail(userEmail).orElse(null);
        if (user == null) {
            LogWrapper.warn("Unauthenticated request: user not found {}", userEmail);
            throw new AppException(ErrorCodes.AUT_002);
        }
        if (userJWTService.isRefreshTokenValid(refreshToken, user)) {
            String accessToken = userJWTService.generateToken(user);
            saveUserToken(user, accessToken);

            var response = LoginResponse.builder()
                    .id(user.getId().toString())
                    .accessToken(accessToken)
                    .accessTokenExpiresIn(userJWTService.getExpiration())
                    .refreshToken(refreshToken)
                    .refreshTokenExpiresIn(userJWTService.getRefreshExpiration())
                    .build();

            return response;
        } else {
            LogWrapper.warn("Unauthenticated request: invalid token for user {}", userEmail);
            throw new AppException(ErrorCodes.AUT_002);
        }

    }

    public void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public boolean validateToken(String token) {
        String userEmail = userJWTService.extractUsername(token);
        if (userEmail == null) {
            return false;
        }

        User user = userService.getUserByEmail(userEmail).orElse(null);
        return user != null && userJWTService.isTokenValid(token, user);

    }
}
