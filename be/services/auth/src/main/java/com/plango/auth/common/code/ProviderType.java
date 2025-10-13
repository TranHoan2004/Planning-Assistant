package com.plango.auth.common.code;

import lombok.Getter;

@Getter
public enum ProviderType {
    GOOGLE("google"),
    FACEBOOK("facebook");

    private final String value;

    ProviderType(String value) {
        this.value = value;
    }

}