package com.plango.auth.config.security.filter;

import com.plango.auth.config.security.JwtAuthenticationEntryPoint;
import com.plango.auth.service.UserJWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final UserJWTService userJWTService;
    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    private static final Logger logger = LoggerFactory.getLogger(JWTAuthenticationFilter.class);
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = authHeader.substring(7);
        String userEmail;

        try {
            userEmail = userJWTService.extractUsername(jwtToken);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                handleAuthentication(jwtToken, userEmail, request, response);
                if (response.isCommitted()) return;
            }
        } catch (Exception e) {
            sendUnauthorized(request, response);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void handleAuthentication(String jwtToken, String userEmail,
                                      HttpServletRequest request,
                                      HttpServletResponse response) throws IOException {
        UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

        if (userJWTService.isTokenValid(jwtToken, userDetails)) {
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } else {
            sendUnauthorized(request, response);
        }
    }

    private void sendUnauthorized(HttpServletRequest request, HttpServletResponse response) throws IOException {
        jwtAuthenticationEntryPoint.commence(request, response,
                new AuthenticationException("Unauthorized") {});
    }
}
