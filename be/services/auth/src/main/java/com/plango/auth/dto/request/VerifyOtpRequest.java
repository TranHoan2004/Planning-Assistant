package com.plango.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import static com.plango.auth.common.constants.Consts.Regex.EMAIL_REGEX;

public record VerifyOtpRequest(
        @NotBlank(message = "OTP must not be blank")
        @Size(min = 6, max = 6, message = "OTP must has exactly 6 characters")
        @Pattern(regexp = "\\d{6}", message = "OTP must contain only digits")
        String otp,

        @Schema(
                description = "User email address. Must follow the format <name>@<domain>.",
                example = "user@example.com"
        )
        @Pattern(regexp = EMAIL_REGEX, message = "Email must follow the format <name>@<domain>")
        String email) {
}
