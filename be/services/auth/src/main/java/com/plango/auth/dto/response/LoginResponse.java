package com.plango.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoginResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("email")
    private String email;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("accessToken")
    private String accessToken;

    @JsonProperty("accessTokenExpiresIn")
    private long accessTokenExpiresIn;

    @JsonProperty("refreshToken")
    private String refreshToken;

    @JsonProperty("refreshTokenExpiresIn")
    private long refreshTokenExpiresIn;
}
