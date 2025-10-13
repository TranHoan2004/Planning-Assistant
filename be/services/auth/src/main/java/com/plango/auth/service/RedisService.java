package com.plango.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisService {
    private final RedisTemplate<String, String> redisTemplate;

    // Lưu token đã bị revoke với TTL = thời gian còn lại
    public void revokeToken(String token, Date expiration) {
        long ttlMillis = expiration.getTime() - System.currentTimeMillis();
        if (ttlMillis > 0) {
            redisTemplate.opsForValue()
                    .set("REVOKED_TOKEN:" + token, "revoked", ttlMillis, TimeUnit.MILLISECONDS);
        }
    }

    public boolean isTokenRevoked(String token) {
        return redisTemplate.hasKey("REVOKED_TOKEN:" + token);
    }

}
