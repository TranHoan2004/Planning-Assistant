package com.plango.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import static com.plango.auth.common.constants.Consts.Regex.EMAIL_REGEX;
import static com.plango.auth.common.constants.Consts.Regex.PASSWORD_REGEX;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
    @Schema(
            description = "User email address. Must follow the format <name>@<domain>.",
            example = "user@example.com"
    )
    @Pattern(regexp = EMAIL_REGEX, message = "Email must follow the format <name>@<domain>")
    String email;

    @Schema(
            description = "User password (8–32 characters). Must include at least one uppercase letter, one digit, and one special character.",
            example = "Abc@1234"
    )
    @Size(min = 8, max = 32, message = "Password must have 8 to 32 characters")
    @Pattern(regexp = PASSWORD_REGEX, message = "Password must have at least one uppercase letter, a digit, a special character")
    String password;
}
