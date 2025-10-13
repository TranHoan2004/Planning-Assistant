package com.plango.auth.service.profile;

import java.util.Map;

import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.common.utils.LogWrapper;
import com.plango.auth.dto.request.ProfileRegisterRequest;
import com.plango.auth.dto.response.ExchangeTokenResponse;
import com.plango.auth.exception.AppException;
import com.plango.auth.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileService {

    @Value("${profile.service.register-url}")
    private String profileServiceRegisterUrl;

    private final RestClient restClient;

    public void createUserProfile(ProfileRegisterRequest profileRequest) {

        Map<String, Object> response = restClient.post()
                .uri(profileServiceRegisterUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(profileRequest)
                .retrieve()
                .body(Map.class);

        Integer statusCode = (Integer) response.get("status_code");
        if (statusCode == null || statusCode != 201) {
            throw new AppException(
                    ErrorCodes.AUT_006,
                    "Failed to create user profile, status_code: " + statusCode);
        }

    }

}
