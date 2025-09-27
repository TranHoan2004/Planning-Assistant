package com.plango.auth.dto.request;

import static com.plango.auth.common.constants.Consts.Regex.EMAIL_REGEX;
import static com.plango.auth.common.constants.Consts.Regex.PASSWORD_REGEX;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterRequest {

    @Email
    @NotBlank
    @JsonProperty("email")
    @Schema(
            description = "User email address",
            example = "example@example.com"
    )
    @Pattern(regexp = EMAIL_REGEX, message = "Email must follow the format <name>@<domain>")
    private String email;

    @Pattern(regexp = PASSWORD_REGEX, message = "Password must have at least one uppercase letter, a digit, a special character")
    @Schema(
            description = "User password (8–32 chars, must include upper/lowercase, number, special character)",
            example = "Abcd1234!"
    )
    @JsonProperty("password")
    private String password;

}
