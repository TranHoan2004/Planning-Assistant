package com.plango.auth.service;

import java.util.Optional;

import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.common.utils.LogWrapper;
import com.plango.auth.exception.AppException;
import com.plango.auth.model.Token;
import com.plango.auth.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class LogoutService implements LogoutHandler {

    @Autowired
    private TokenRepository tokenRepository;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        final String token = extractJwtTokenFromHeader(request);
        if (token == null) {
            LogWrapper.warn("Token not found in header");
            throw new AppException(ErrorCodes.AUT_004);
        }

        Token storedToken = tokenRepository.findByToken(token).orElse(null);
        if (storedToken != null) {
            storedToken.setExpired(true);
            storedToken.setRevoked(true);
            tokenRepository.save(storedToken);
            LogWrapper.info("Token revoked");
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
        } else {
            LogWrapper.error("Token not found");
            throw new AppException(ErrorCodes.AUT_001);
        }
    }

    private String extractJwtTokenFromHeader(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}
