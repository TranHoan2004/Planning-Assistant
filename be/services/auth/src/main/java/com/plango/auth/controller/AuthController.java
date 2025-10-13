package com.plango.auth.controller;

import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.dto.request.*;
import com.plango.auth.dto.response.UserResponse;
import com.plango.auth.dto.response.ValidateTokenResponse;
import com.plango.auth.event.SendingEmailReadEvent;
import com.plango.auth.exception.AppException;
import com.plango.auth.mapper.UserMapper;
import com.plango.auth.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.plango.auth.common.code.StatusFlag;
import com.plango.auth.common.utils.LogWrapper;
import com.plango.auth.dto.response.BaseJsonResponse;
import com.plango.auth.dto.response.RegisterResponse;
import com.plango.auth.service.AuthService;
import com.plango.auth.service.LogoutService;
import com.plango.auth.service.UserService;

import jakarta.validation.Valid;

import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final LogoutService logoutService;

    private final UserService userService;

    private final UserMapper userMapper;

    private final ApplicationEventPublisher eventPublisher;

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BaseJsonResponse> authenticate(@Valid @RequestBody EmailAndPasswordRequest request) {
        try {

            var result = authService.authenticate(request);

            BaseJsonResponse response = BaseJsonResponse.builder()
                    .status(StatusFlag.SUCCESS.getValue())
                    // login success
                    .message("User logged in successfully")
                    .result(result).build();

            return ResponseEntity.ok(response);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseJsonResponse.builder()
                    .status(StatusFlag.ERROR.getValue())
                    // login failed
                    .message("User logged in failed")
                    .build());
        }

    }

    @RequestMapping(value = "/register", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BaseJsonResponse> register(@Valid @RequestBody RegisterRequest request) {

        RegisterResponse result = authService.register(request);
        String userId = result.getId();
        LogWrapper.info("User register. userId: " + userId);
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(BaseJsonResponse.builder()
                            .status(StatusFlag.ERROR.getValue())
                            .message("User registered failed")
                            .build());
        }
        BaseJsonResponse response = BaseJsonResponse.builder()
                .status(StatusFlag.SUCCESS.getValue())
                .message("User registered successfully")
                .result(result).build();

        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/refreshToken", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BaseJsonResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            var result = authService.refreshToken(request);
            BaseJsonResponse response = BaseJsonResponse.builder()
                    .status(StatusFlag.SUCCESS.getValue())
                    .result(result).build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseJsonResponse.builder()
                            .status(StatusFlag.ERROR.getValue())
                            .build());

        }

    }

    @PostMapping(value = "/logout")
    public ResponseEntity<BaseJsonResponse> logout(LogoutRequest request) {
        try {
            logoutService.logout(request);

            BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                    .status(StatusFlag.SUCCESS.getValue())
                    .message("logout successful")
                    .build();

            return ResponseEntity.ok(apiResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseJsonResponse.builder()
                            .status(StatusFlag.ERROR.getValue())
                            .build());
        }

    }

    @GetMapping(value = "/me")
    public ResponseEntity<BaseJsonResponse> getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseJsonResponse.builder()
                            .status(StatusFlag.ERROR.getValue())
                            .build());
        }
        try {
            var userDetails = (UserDetails) authentication.getPrincipal();
            User user = userService.getUserByEmail(userDetails.getUsername()).orElse(null);
            UserResponse userResponse = userMapper.toUserResponse(user);

            return ResponseEntity.ok(
                    BaseJsonResponse.builder()
                            .status(StatusFlag.SUCCESS.getValue())
                            .result(userResponse)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseJsonResponse.builder()
                            .status(StatusFlag.ERROR.getValue())
                            .build());
        }

    }

    @PostMapping("/inspect")
    public ResponseEntity<ValidateTokenResponse> validateToken(@RequestBody ValidateTokenRequest request) {
        try {
            boolean isValid = authService.validateToken(request.getToken());

            ValidateTokenResponse response = ValidateTokenResponse.builder()
                    .valid(isValid)
                    .build();

            return isValid
                    ? ResponseEntity.ok(response)
                    : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ValidateTokenResponse.builder()
                            .valid(false)
                            .build());
        }
    }

    // <editor-fold> desc="forgot password feature"
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody VerifyEmailRequest request) {
        var result = userService.isEmailExists(request.email());
        LogWrapper.info("Verify email: " + request.email());

        var status = result ? StatusFlag.SUCCESS.getValue() : StatusFlag.ERROR.getValue();
        var code = result ? String.valueOf(HttpStatus.OK.value()): ErrorCodes.REG_002;
        var message = result ? "Verify email successfully" : "Verify email failed";

        return ResponseEntity.ok(BaseJsonResponse.builder()
                .status(status)
                .message(message)
                .code(code)
                .build());
    }

    @GetMapping("/otp")
    public ResponseEntity<?> getOTPCode(@RequestParam String email) {
        var result = userService.isEmailExists(email);
        if (!result) {
            return ResponseEntity.ok(BaseJsonResponse.builder()
                    .status(StatusFlag.SUCCESS.getValue())
                    .message("Email is not existing")
                    .code(ErrorCodes.REG_002)
                    .build());
        }

        var random = new Random();
        random.setSeed(System.currentTimeMillis());
        var otp = 100000 + random.nextInt(900000);

        eventPublisher.publishEvent(new SendingEmailReadEvent(email, String.valueOf(otp)));
        return ResponseEntity.ok(BaseJsonResponse.builder()
                .status(StatusFlag.SUCCESS.getValue())
                .result(otp)
                .message("Generate otp successfully")
                .build());
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody EmailAndPasswordRequest request) {
        userService.updatePassword(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(BaseJsonResponse.builder()
                .status(StatusFlag.SUCCESS.getValue())
                .message("Reset password successfully")
                .build());
    }
    // </editor-fold>

    @PostMapping("/outbound/{provider}/authenticate")
    public ResponseEntity<BaseJsonResponse> outboundAuthenticate(@PathVariable String provider,
            @RequestBody Oauth2LoginRequest request) {
        try {
            var result = authService.loginWithOauth2O(request.getCode(), provider);
            BaseJsonResponse response = BaseJsonResponse.builder()
                    .status(StatusFlag.SUCCESS.getValue())
                    .result(result).build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseJsonResponse.builder()
                            .status(StatusFlag.ERROR.getValue())
                            .build());

        }

    }
}
