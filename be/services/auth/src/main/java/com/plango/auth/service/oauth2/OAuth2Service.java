package com.plango.auth.service.oauth2;

import com.plango.auth.dto.response.OnboardingUser;

public interface OAuth2Service {
    OnboardingUser getUser(String code);
}
