package com.plango.auth.service;

import java.util.Date;

import com.plango.auth.dto.request.LogoutRequest;
import com.plango.auth.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService  {

    private final UserJWTService userJWTService;
    private final RedisService redisService;

    public void logout(LogoutRequest request) {
        String accessToken = request.getAccessToken();
        String refreshToken = request.getRefreshToken();

        Date accessExp = userJWTService.extractExpiration(accessToken);
        redisService.revokeToken(accessToken, accessExp);

        Date refreshExp = userJWTService.extractExpiration(refreshToken);
        redisService.revokeToken(refreshToken, refreshExp);

    }
}
