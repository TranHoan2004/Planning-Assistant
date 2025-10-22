package com.plango.auth.controller;

import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.dto.request.*;
import com.plango.auth.dto.response.UserResponse;
import com.plango.auth.dto.response.ValidateTokenResponse;
import com.plango.auth.event.SendingEmailReadEvent;
import com.plango.auth.exception.AppException;
import com.plango.auth.mapper.UserMapper;
import com.plango.auth.model.User;
import com.plango.auth.event.EmailQueueProducer;
import com.plango.auth.service.OtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {

    AuthService authService;
    LogoutService logoutService;
    UserService userService;
    UserMapper userMapper;
    EmailQueueProducer eventPublisher;
    OtpService otpSrv;

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
    @PostMapping(value = "/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody @Valid VerifyEmailRequest request) {
        var result = userService.isEmailExists(request.email());
        LogWrapper.info("Verify email: " + request.email());

        var status = result ? StatusFlag.SUCCESS.getValue() : StatusFlag.ERROR.getValue();
        var code = result ? String.valueOf(HttpStatus.OK.value()) : ErrorCodes.REG_002;
        var message = result ? "Verify email successfully" : "Verify email failed";

        return ResponseEntity.ok(BaseJsonResponse.builder()
                .status(status)
                .message(message)
                .code(code)
                .build());
    }

    @GetMapping(value = "/send-otp")
    public ResponseEntity<?> getOTPCode(@RequestParam String email) {
        var response = isUserExisting(email);
        if (response != null) return response;

        if (otpSrv.isOtpStillValid(email)) {
            return ResponseEntity.badRequest().body(BaseJsonResponse.builder()
                    .status(StatusFlag.ERROR.getValue())
                    .message("OTP still valid")
                    .code("400")
                    .build()
            );
        }

        if (!otpSrv.canRequestOtp(email)) {
            return ResponseEntity.badRequest().body(BaseJsonResponse.builder()
                    .status(StatusFlag.ERROR.getValue())
                    .message("Too many OTP requests. Please try again later.")
                    .code(HttpStatus.BAD_REQUEST.toString())
                    .build());
        }

        var random = new Random();
        random.setSeed(System.currentTimeMillis());
        var otp = 100000 + random.nextInt(900000);
        otpSrv.saveOtp(email, String.valueOf(otp));

        otpSrv.generateToken(email);

        eventPublisher.publish(
                new SendingEmailReadEvent(
                        email,
                        String.valueOf(otp)
                )
        );

        if (otpSrv.getOtp(email) == null) {
            return ResponseEntity.ok(BaseJsonResponse.builder()
                    .status(StatusFlag.ERROR.getValue())
                    .message("Error when sending email")
                    .code(String.valueOf(HttpStatus.INTERNAL_SERVER_ERROR.value()))
                    .build());
        }

        return ResponseEntity.ok(BaseJsonResponse.builder()
                .status(StatusFlag.SUCCESS.getValue())
                .message("Generate otp successfully")
                .code(String.valueOf(HttpStatus.ACCEPTED.value()))
                .build());
    }

    @PostMapping(value = "/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody @Valid VerifyOtpRequest request) {
        var otp = otpSrv.getOtp(request.email());
        if (otp == null || !otp.equals(request.otp())) {
            return ResponseEntity.badRequest().body(BaseJsonResponse.builder()
                    .status(StatusFlag.ERROR.getValue())
                    .message("Invalid OTP")
                    .code("400")
                    .build());
        }

        if (!otpSrv.isTokenStillValid(request.email())) {
            return ResponseEntity.badRequest().body(BaseJsonResponse.builder()
                    .status(StatusFlag.ERROR.getValue())
                    .message("OTP is expired")
                    .code("400")
                    .build());
        }

        otpSrv.deleteOtp(request.email());
        return ResponseEntity.ok(BaseJsonResponse.builder()
                .status(StatusFlag.SUCCESS.getValue())
                .message("OTP verified successfully")
                .build());
    }

    @PatchMapping(value = "/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid EmailAndPasswordRequest request) {
        var response = isUserExisting(request.getEmail());
        if (response != null) return response;

        if (otpSrv.isTokenStillValid(request.getEmail())) {
            userService.updatePassword(request.getEmail(), request.getPassword());
            otpSrv.deleteToken(request.getEmail());
        } else {
            return ResponseEntity.badRequest().body(BaseJsonResponse.builder()
                    .status(StatusFlag.ERROR.getValue())
                    .message("Token is invalid or expired")
                    .code("400")
                    .build());
        }

        return ResponseEntity.ok(BaseJsonResponse.builder()
                .status(StatusFlag.SUCCESS.getValue())
                .message("Reset password successfully")
                .build());
    }

    private ResponseEntity<?> isUserExisting(String email) {
        var result = userService.isEmailExists(email);
        if (!result) {
            return ResponseEntity.badRequest().body(BaseJsonResponse.builder()
                    .status(StatusFlag.SUCCESS.getValue())
                    .message("Email is not existing")
                    .code(ErrorCodes.REG_002)
                    .build());
        }
        return null;
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
