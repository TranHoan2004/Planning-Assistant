package com.plango.auth.controller;

import com.plango.auth.dto.request.ValidateTokenRequest;
import com.plango.auth.dto.response.UserResponse;
import com.plango.auth.dto.response.ValidateTokenResponse;
import com.plango.auth.exception.AppException;
import com.plango.auth.mapper.UserMapper;
import com.plango.auth.model.User;
import com.plango.auth.service.UserJWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.plango.auth.common.code.StatusFlag;
import com.plango.auth.common.utils.LogWrapper;
import com.plango.auth.dto.request.LoginRequest;
import com.plango.auth.dto.request.RefreshTokenRequest;
import com.plango.auth.dto.request.RegisterRequest;
import com.plango.auth.dto.response.BaseJsonResponse;
import com.plango.auth.dto.response.RegisterResponse;
import com.plango.auth.service.AuthService;
import com.plango.auth.service.LogoutService;
import com.plango.auth.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private LogoutService logoutService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BaseJsonResponse> authenticate(@Valid @RequestBody LoginRequest request) {
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
       try{
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
    public ResponseEntity<BaseJsonResponse> logout(Authentication authentication,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response)
    {
        try {
             logoutService.logout(request, response, authentication);

            BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                    .status(StatusFlag.SUCCESS.getValue())
                    .message("logout successful")
                    .build();

            return ResponseEntity.ok(apiResponse);

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseJsonResponse.builder()
                    .status(StatusFlag.ERROR.getValue())
                    // login failed
                    .message("User logout failed")
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
            try{
                var userDetails = (UserDetails) authentication.getPrincipal();
                User user =   userService.getUserByEmail(userDetails.getUsername()).orElse(null);
                UserResponse userResponse = userMapper.toUserResponse(user);


                return ResponseEntity.ok(
                        BaseJsonResponse.builder()
                                .status(StatusFlag.SUCCESS.getValue())
                                .result(userResponse)
                                .build()
                );
            }catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(BaseJsonResponse.builder()
                                .status(StatusFlag.ERROR.getValue())
                                .build());
            }

    }

    @PostMapping("/inspect")
    public ResponseEntity<ValidateTokenResponse> validateToken( @RequestBody ValidateTokenRequest request) {
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
                            .build()
            );
        }
    }
}
