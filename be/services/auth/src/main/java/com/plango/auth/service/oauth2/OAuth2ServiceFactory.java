package com.plango.auth.service.oauth2;

import com.plango.auth.common.code.ProviderType;
import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.dto.response.OnboardingUser;
import com.plango.auth.exception.AppException;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class OAuth2ServiceFactory {

    private final Map<ProviderType, OAuth2Service> serviceMap;

    public OAuth2ServiceFactory(GoogleOAuth2Service googleOAuth2Service, FacebookOAuth2Service facebookOAuth2Service) {
        this.serviceMap = Map.of(
                ProviderType.GOOGLE, googleOAuth2Service,
                ProviderType.FACEBOOK, facebookOAuth2Service);
    }

    public OAuth2Service getService(ProviderType providerType) {
        OAuth2Service service = serviceMap.get(providerType);
        if (service == null) {
            throw new AppException(ErrorCodes.AUT_005);
        }
        return service;
    }
}