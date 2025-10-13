package com.plango.auth.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OnboardingUser {
    private String userId;
    private String email;
    private String name;
    private String avatarUrl;
}
