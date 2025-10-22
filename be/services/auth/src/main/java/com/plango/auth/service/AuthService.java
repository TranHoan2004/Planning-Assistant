package com.plango.auth.service;

import java.util.Optional;
import java.util.UUID;

import com.plango.auth.common.code.ProviderType;
import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.dto.request.EmailAndPasswordRequest;
import com.plango.auth.dto.request.ProfileRegisterRequest;
import com.plango.auth.dto.request.RefreshTokenRequest;
import com.plango.auth.dto.request.RegisterRequest;
import com.plango.auth.dto.response.LoginResponse;
import com.plango.auth.dto.response.OnboardingUser;
import com.plango.auth.dto.response.RegisterResponse;
import com.plango.auth.exception.AppException;
import com.plango.auth.mapper.UserMapper;
import com.plango.auth.model.User;
import com.plango.auth.model.UserProvider;
import com.plango.auth.repository.UserProviderRepository;
import com.plango.auth.repository.UserRepository;
import com.plango.auth.service.oauth2.OAuth2Service;
import com.plango.auth.service.oauth2.OAuth2ServiceFactory;
import com.plango.auth.service.profile.ProfileService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.plango.auth.common.utils.LogWrapper;
import com.plango.auth.config.security.client.Oauth2GoogleClient;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationProvider authenticationProvider;
    private final UserJWTService userJWTService;
    private final UserMapper userMapper;
    private final UserService userService;
    private final UserRepository repository;
    private final Oauth2GoogleClient outboundIdentityClient;
    private final UserProviderRepository userProviderRepository;
    private final OAuth2ServiceFactory oauth2ServiceFactory;
    private final ProfileService profileService;

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
        ProfileRegisterRequest profileRequest = ProfileRegisterRequest.builder()
                .userId(savedUser.getId().toString())
                .userFullName(savedUser.getEmail().split("@")[0])
                .userAvatar(request.getAvatarUrl())
                .build();
        try {
            profileService.createUserProfile(profileRequest);
        } catch (Exception e) {
            LogWrapper.error("Failed to create user profile in external system: " + e.getMessage(), e);
        }

        return userMapper.toRegisterResponseDto(savedUser);
    }

    public LoginResponse authenticate(EmailAndPasswordRequest request) {
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

        LoginResponse response = userMapper.toLoginResponseDto(user);
        response.setAccessToken(accessToken);
        response.setAccessTokenExpiresIn(userJWTService.getExpiration());
        response.setRefreshToken(refreshToken);
        response.setRefreshTokenExpiresIn(userJWTService.getRefreshExpiration());
        return response;
    }

    public LoginResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String userEmail;
        try {
            userEmail = userJWTService.extractUsername(refreshToken);
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

    public boolean validateToken(String token) {
        String userEmail = userJWTService.extractUsername(token);
        if (userEmail == null) {
            return false;
        }

        User user = userService.getUserByEmail(userEmail).orElse(null);
        return user != null && userJWTService.isTokenValid(token, user);

    }

    public LoginResponse loginWithOauth2O(String code, String provider) {
        ProviderType providerType = ProviderType.valueOf(provider.toUpperCase());
        OAuth2Service oauth2Service = oauth2ServiceFactory.getService(providerType);
        OnboardingUser onboardingUser = oauth2Service.getUser(code);

        User user = findOrRegisterUser(onboardingUser);

        linkProvider(user, providerType.name().toLowerCase(), onboardingUser.getUserId());

        LoginResponse loginResponse = userMapper.toLoginResponseDto(user);
        populateTokens(user, loginResponse);

        return loginResponse;
    }

    private User findOrRegisterUser(OnboardingUser onboardingUser) {
        return userService.getUserByEmail(onboardingUser.getEmail())
                .orElseGet(() -> registerOauth2User(onboardingUser));
    }

    private User registerOauth2User(OnboardingUser onboardingUser) {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email(onboardingUser.getEmail())
                .password(UUID.randomUUID().toString())
                .avatarUrl(onboardingUser.getAvatarUrl())
                .build();

        register(registerRequest);

        return userService.getUserByEmail(onboardingUser.getEmail())
                .orElseThrow(() -> new AppException(ErrorCodes.AUT_005));
    }

    private void linkProvider(User user, String provider, String providerId) {
        try {
            boolean exists = userProviderRepository.getProviderByProviderId(providerId)
                    .isPresent();

            if (!exists) {
                UserProvider newProvider = UserProvider.builder()
                        .provider(provider)
                        .providerId(providerId)
                        .user(user)
                        .build();

                userProviderRepository.save(newProvider);
            }
        } catch (Exception e) {
            LogWrapper.error("Failed to link OAuth2 provider to user: " + e.getMessage(), e);
        }
    }

    private void populateTokens(User user, LoginResponse loginResponse) {
        String accessToken = userJWTService.generateToken(user);
        String refreshToken = userJWTService.generateRefreshToken(user);

        loginResponse.setAccessToken(accessToken);
        loginResponse.setAccessTokenExpiresIn(userJWTService.getExpiration());
        loginResponse.setRefreshToken(refreshToken);
        loginResponse.setRefreshTokenExpiresIn(userJWTService.getRefreshExpiration());
    }
}
