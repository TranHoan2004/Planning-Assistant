package com.plango.auth.service.oauth2;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.plango.auth.config.security.client.Oauth2GoogleClient;
import com.plango.auth.dto.response.ExchangeTokenResponse;
import com.plango.auth.dto.response.GoogleUserResponse;
import com.plango.auth.dto.response.OnboardingUser;

@Service
@RequiredArgsConstructor
public class GoogleOAuth2Service implements OAuth2Service {

    private final Oauth2GoogleClient outboundIdentityClient;

    @Override
    public OnboardingUser getUser(String code) {
        ExchangeTokenResponse tokenResponse = outboundIdentityClient.exchangeToken(code);
        GoogleUserResponse userInfo = outboundIdentityClient.getUserInfo(tokenResponse.getAccessToken());

        return OnboardingUser.builder()
                .userId(userInfo.getSub())
                .email(userInfo.getEmail())
                .name(userInfo.getName())
                .avatarUrl(userInfo.getPicture())
                .build();
    }
}
