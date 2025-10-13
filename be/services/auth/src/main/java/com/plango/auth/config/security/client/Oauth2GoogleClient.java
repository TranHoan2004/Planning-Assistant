package com.plango.auth.config.security.client;

import com.plango.auth.dto.request.ExchangeTokenRequest;
import com.plango.auth.dto.response.ExchangeTokenResponse;
import com.plango.auth.dto.response.GoogleUserResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class Oauth2GoogleClient {

    private final RestClient restClient;

    @Value("${outbound.identity.google.token-url}")
    private String tokenUrl;
    @Value("${outbound.identity.google.userinfo-url}")
    private String userinfoUrl;
    @Value("${outbound.identity.google.client-id}")
    private String clientId;
    @Value("${outbound.identity.google.client-secret}")
    private String clientSecret;
    @Value("${outbound.identity.google.redirect-uri}")
    private String redirectUri;
    @Value("${outbound.identity.google.grant-type}")
    private String grantType;

    public ExchangeTokenResponse exchangeToken(String code) {
        String formBody = UriComponentsBuilder.newInstance()
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("code", code)
                .queryParam("grant_type", grantType)
                .queryParam("redirect_uri", redirectUri)
                .build()
                .toUriString()
                .substring(1);

        return restClient.post()
                .uri(tokenUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formBody)
                .retrieve()
                .body(ExchangeTokenResponse.class);
    }

    public GoogleUserResponse getUserInfo(String accessToken) {
        return restClient.get()
                .uri(userinfoUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(GoogleUserResponse.class);
    }
}
