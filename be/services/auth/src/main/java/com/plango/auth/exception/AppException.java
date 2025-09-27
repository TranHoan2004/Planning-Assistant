package com.plango.auth.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AppException extends RuntimeException {
    String code;
    Object[] args;

    public AppException(String code, Object... args) {
        super();
        this.code = code;
        this.args = args;
    }

    public AppException(String code, Throwable cause, Object... args) {
        super();
        this.code = code;
        this.args = args;
    }
}
