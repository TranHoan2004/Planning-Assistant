package com.plango.auth.config.security.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import lombok.RequiredArgsConstructor;

import com.plango.auth.dto.response.ExchangeTokenResponse;
import com.plango.auth.dto.response.FacebookUserResponse;

@Component
@RequiredArgsConstructor
public class Oauth2FacebookClient {

    @Value("${outbound.identity.facebook.token-url}")
    private String tokenUrl;

    @Value("${outbound.identity.facebook.userinfo-url}")
    private String userinfoUrl;

    @Value("${outbound.identity.facebook.client-id}")
    private String clientId;

    @Value("${outbound.identity.facebook.client-secret}")
    private String clientSecret;

    @Value("${outbound.identity.facebook.redirect-uri}")
    private String redirectUri;

    @Value("${outbound.identity.facebook.grant-type}")
    private String grantType;

    private final RestClient restClient;

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

    public FacebookUserResponse getUserInfo(String accessToken) {
        return restClient.get()
                .uri(userinfoUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(FacebookUserResponse.class);
    }
}
