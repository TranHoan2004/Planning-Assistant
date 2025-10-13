package com.plango.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileRegisterRequest {
    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("user_fullname")
    private String userFullName;

    @JsonProperty("user_avatar")
    private String userAvatar;

}
