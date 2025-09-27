package com.plango.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Base class for responses
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BaseJsonResponse {

    @Default
    @JsonProperty("status")
    private String status = null;

    @Default
    @JsonProperty("code")
    private String code = null;

    @Default
    @JsonProperty("message")
    private String message = null;

    @Default
    @JsonProperty("result")
    private Object result = null;

}
