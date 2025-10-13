package com.plango.auth.service.oauth2;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.plango.auth.config.security.client.Oauth2FacebookClient;
import com.plango.auth.config.security.client.Oauth2GoogleClient;
import com.plango.auth.dto.response.ExchangeTokenResponse;
import com.plango.auth.dto.response.FacebookUserResponse;
import com.plango.auth.dto.response.GoogleUserResponse;
import com.plango.auth.dto.response.OnboardingUser;

@Service
@RequiredArgsConstructor
public class FacebookOAuth2Service implements OAuth2Service {

    private final Oauth2FacebookClient outboundIdentityClient;

    @Override
    public OnboardingUser getUser(String code) {
        ExchangeTokenResponse tokenResponse = outboundIdentityClient.exchangeToken(code);
        FacebookUserResponse userInfo = outboundIdentityClient.getUserInfo(tokenResponse.getAccessToken());

        return OnboardingUser.builder()
                .userId(userInfo.getId())
                .email(userInfo.getEmail())
                .name(userInfo.getName())
                .avatarUrl(userInfo.getPicture())
                .build();
    }
}
