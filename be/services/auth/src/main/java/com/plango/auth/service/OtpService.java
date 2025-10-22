package com.plango.auth.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpService {
    RedisTemplate<String, String> redisTemplate;

    static long OTP_TTL_SECONDS = 300;
    static long LIMIT_TTL_SECONDS = 3600;
    static int MAX_REQUESTS_PER_HOUR = 5;

    // <editor-fold> desc="Handle OTP business"
    public boolean canRequestOtp(String email) {
        var limitKey = "otp:limit:" + email;
        var currentCount = redisTemplate.opsForValue().increment(limitKey);

        if (currentCount != null && currentCount == 1) {
            redisTemplate.expire(limitKey, Duration.ofSeconds(LIMIT_TTL_SECONDS));
        }
        return currentCount != null && currentCount <= MAX_REQUESTS_PER_HOUR;
    }

    public boolean isOtpStillValid(String email) {
        return redisTemplate.hasKey("otp:" + email);
    }

    public void saveOtp(String email, String otp) {
        var otpKey = "otp:" + email;
        redisTemplate.opsForValue().set(otpKey, otp, Duration.ofSeconds(OTP_TTL_SECONDS));
    }

    public String getOtp(String email) {
        return redisTemplate.opsForValue().get("otp:" + email);
    }

    public void deleteOtp(String email) {
        redisTemplate.delete("otp:" + email);
    }

    // </editor-fold>

    // <editor-fold> desc="Handle Token business"
    public void generateToken(String email) {
        redisTemplate.opsForValue().set(
                "token:" + email,
                UUID.randomUUID().toString(),
                Duration.ofSeconds(OTP_TTL_SECONDS));
    }

    public boolean isTokenStillValid(String email) {
        return redisTemplate.hasKey("token:" + email);
    }

    public void deleteToken(String email) {
        redisTemplate.delete("token:" + email);
    }
    // </editor-fold>
}
