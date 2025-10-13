package com.plango.auth.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
@RequiredArgsConstructor
public class UserJWTService {
    @Value("${exe.security.jwt.secret-key}")
    private String secretKey;

    @Value("${exe.security.jwt.expiration}")
    private long jwtExpiration;

    @Value("${exe.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    private final RedisService redisService;


    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        extraClaims.put("type", "access");
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("type", "refresh");
        return buildToken(extraClaims, userDetails, refreshExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();

    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        if (redisService.isTokenRevoked(token)) {
            return false;
        }
        final String username = extractUsername(token);
        final String type = extractClaim(token, claims -> claims.get("type", String.class));
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token) && "access".equals(type));
    }

    public boolean isRefreshTokenValid(String token, UserDetails userDetails) {
        if (redisService.isTokenRevoked(token)) {
            return false;
        }
        final String username = extractUsername(token);
        final String type = extractClaim(token, claims -> claims.get("type", String.class));
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token) && "refresh".equals(type));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Get expiration time in seconds
    public long getExpiration() {
        return jwtExpiration / 1000;
    }

    // Get refresh expiration time in seconds
    public long getRefreshExpiration() {
        return refreshExpiration / 1000;
    }
}
