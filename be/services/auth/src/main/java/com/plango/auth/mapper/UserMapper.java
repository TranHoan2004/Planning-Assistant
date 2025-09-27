package com.plango.auth.mapper;

import com.plango.auth.dto.request.RegisterRequest;
import com.plango.auth.dto.response.LoginResponse;
import com.plango.auth.dto.response.RegisterResponse;
import com.plango.auth.dto.response.UserResponse;
import com.plango.auth.model.User;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;


@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class UserMapper {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public abstract RegisterRequest toRegisterRequestDto(User user);

    public abstract LoginResponse toLoginResponseDto(User user);

    public abstract RegisterResponse toRegisterResponseDto(User user);

    @Mapping(source = "email", target = "email")
    public abstract User toEntity(RegisterRequest request);

    @AfterMapping
    protected void encodePassword(@MappingTarget User user, RegisterRequest request) {
        user.setPassword(passwordEncoder.encode(request.getPassword()));
    }

    public abstract UserResponse toUserResponse(User user);
}
