package com.plango.auth.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.plango.auth.common.utils.LogWrapper;
import com.plango.auth.service.OtpService;
import com.plango.auth.service.email.EmailService;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailQueueConsumer implements MessageListener {
    ObjectMapper mapper;
    OtpService otpSrv;
    EmailService srv;
    static String CONTENT = """
            <!doctype html>
                        <html>
                          <head>
                            <meta charset="utf-8" />
                            <title>Your OTP</title>
                          </head>
                          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background:#f6f7fb; margin:0; padding:20px;">
                            <div style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e6e9ef; border-radius:8px; padding:24px;">
                              <h2 style="margin:0 0 12px 0; color:#111; font-size:20px;">Planggo — Password Reset</h2>

                              <p style="margin:0 0 12px 0; color:#222; font-size:14px;">
                                Hello,
                              </p>

                              <p style="margin:0 0 16px 0; color:#222; font-size:14px;">
                                Use the one-time verification code below to reset your password. The code is valid for <strong>5 minutes</strong>.
                              </p>

                              <div style="background:#f4f6f8; padding:14px 18px; border-radius:6px; font-family: 'Courier New', monospace; font-size:20px; letter-spacing:4px; text-align:center; border:1px dashed #d7dce3; color:#111; margin:0 0 18px 0;">
                                %s
                              </div>

                              <p style="margin:0 0 12px 0; color:#666; font-size:13px;">
                                If you did not request a password reset, you can safely ignore this email — the code will expire automatically.
                              </p>

                              <hr style="border:none; border-top:1px solid #eef1f5; margin:20px 0;" />

                              <p style="margin:0; font-size:12px; color:#888;">
                                This is an automated message — please do not reply. For support, contact: <a href="mailto:heheh@gmail.com" style="color:#1f6feb; text-decoration:none;">heheh@gmail.com</a>
                              </p>

                              <p style="margin:8px 0 0 0; font-size:12px; color:#888;">
                                Planggo Team, Hanoi, Vietnam
                              </p>
                            </div>
                          </body>
                        </html>
            """;

    @Override
    public void onMessage(@NonNull Message message, byte[] pattern) {
        String email = "";
        try {
            var jsonNode = mapper.readTree(message.getBody());
            email = jsonNode.path("email").asText("");

            var event = mapper.treeToValue(jsonNode, SendingEmailReadEvent.class);
            email = event.email();

            var content = CONTENT.formatted(event.code());
            LogWrapper.info(event.code());

            srv.sendNormalEmail(event.email(), "Verify your email", content);
            LogWrapper.info("Send verification email to " + event.email());
        } catch (MessagingException e) {
            otpSrv.deleteOtp(email);
            LogWrapper.error("Error when sending email: " + e.getMessage());
        } catch (IOException e) {
            LogWrapper.error("Error happening when parsing request");
        }
    }

//    RedisTemplate<String, Object> redisTemplate;
//    static String QUEUE_KEY = "email:otp:queue";
//    @Scheduled(fixedDelay = 1000)
//    public void processQueue() {
//        while (true) {
//            SendingEmailReadEvent event = (SendingEmailReadEvent) redisTemplate
//                    .opsForList()
//                    .leftPop(QUEUE_KEY);
//            if (event == null) break;
//            handleEvent(event);
//        }
//    }

//    private void handleEvent(SendingEmailReadEvent event) {
//        try {
//            var content = CONTENT.formatted(event.code());
//            srv.sendNormalEmail(event.email(), "Verify your email", content);
//            LogWrapper.info("Send verification email to " + event.email());
//        } catch (Exception e) {
//            LogWrapper.error("Failed to send verification email to " + event.email() + ": " + e.getMessage());
//        }
//    }
}
