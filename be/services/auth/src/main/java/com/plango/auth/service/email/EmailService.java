package com.plango.auth.service.email;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendNormalEmail(String to, String subject, String body) throws MessagingException;

    void sendEmailWithAttachFile(String to, String subject, String body, String path) throws MessagingException;
}
