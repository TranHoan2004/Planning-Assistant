package com.plango.auth.event;

import com.plango.auth.common.utils.LogWrapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailQueueProducer {
    RedisTemplate<String, Object> redisTemplate;
    ChannelTopic otpTopic;

    public void pushToQueue(SendingEmailReadEvent event) {
        redisTemplate.opsForList().rightPush("email:otp:queue", event);
    }

    public void publish(SendingEmailReadEvent event) {
        LogWrapper.info("Publishing event to OTP topic: " + otpTopic.getTopic());
        redisTemplate.convertAndSend(otpTopic.getTopic(), event);
    }
}
