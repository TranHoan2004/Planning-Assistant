package com.plango.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;

public record VerifyEmailRequest(
        @Email(message = "Email must follow the format <name>@<domain>")
        @Schema(
                description = "User email address. Must follow the format <name>@<domain>.",
                example = "user@example.com"
        )
        String email
) {
}
