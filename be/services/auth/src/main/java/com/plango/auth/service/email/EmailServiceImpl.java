package com.plango.auth.service.email;

import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailServiceImpl implements EmailService {
    JavaMailSender mailSender;

    @NonFinal
    @Value("${spring.mail.username}")
    String SENDER_EMAIL;

    @Override
    public void sendNormalEmail(String to, String subject, String body) throws MessagingException {
        var message = mailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

        helper.setFrom(SENDER_EMAIL);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // true = html

        mailSender.send(message);
    }

    @Override
    public void sendEmailWithAttachFile(String to, String subject, String body, String path) throws MessagingException {
        var message = mailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());

        helper.setFrom(SENDER_EMAIL);
        helper.setTo(to);
        helper.setSubject(subject);

        var file = new FileSystemResource(new File(path));
        helper.addAttachment(file.getFilename(), file);

        mailSender.send(message);
    }
}
