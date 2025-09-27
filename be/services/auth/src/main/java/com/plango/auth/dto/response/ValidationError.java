package com.plango.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ValidationError {

    @JsonProperty("field")
    private String field;

    @JsonProperty("message")
    private String message;

    public ValidationError(String field, String message) {
        this.field = field;
        this.message = message;
    }
}
