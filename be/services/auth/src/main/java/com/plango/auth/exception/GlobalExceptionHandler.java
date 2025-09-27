/**
 * Global Exception Handler
 *
 * Created At: 2024/12/16
 * Author:    HungNH
 */

package com.plango.auth.exception;

import java.security.SignatureException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.http.converter.HttpMessageNotReadableException;

import com.plango.auth.common.code.StatusFlag;
import com.plango.auth.common.constants.ErrorCodes;
import com.plango.auth.common.utils.LogWrapper;
import com.plango.auth.dto.response.BaseJsonResponse;
import com.plango.auth.dto.response.ValidationError;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Handling Unexpected Exception
     *
     * @param exception
     * @return
     */
    @ExceptionHandler({ Exception.class, Throwable.class })
    public ResponseEntity<BaseJsonResponse> handlingUnexpectedException(Exception exception) {

        LogWrapper.error("Exception: ", exception);

        String message = messageSource.getMessage(ErrorCodes.COM_001, null, LocaleContextHolder.getLocale());

        BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                .status(StatusFlag.ERROR.getValue())
                .code(ErrorCodes.COM_001)
                .message(message)
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }

    /**
     * Handling App Exception
     *
     * @param exception
     * @return
     */
    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<BaseJsonResponse> handlingAppException(AppException exception) {

        String message = messageSource.getMessage(exception.getCode(), exception.getArgs(),
                LocaleContextHolder.getLocale());

        BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                .status(StatusFlag.ERROR.getValue())
                .code(exception.getCode())
                .message(message)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    /**
     * Handling Access Denied Exception
     *
     * @param exception
     * @return
     */
    @ExceptionHandler({
            AccessDeniedException.class,
            UsernameNotFoundException.class,
            BadCredentialsException.class,
            SignatureException.class,
            ExpiredJwtException.class
    })
    public ResponseEntity<BaseJsonResponse> handleSecurityException(Exception exception) {
        String message = messageSource.getMessage(ErrorCodes.AUT_004, null, LocaleContextHolder.getLocale());

        BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                .status(StatusFlag.ERROR.getValue())
                .code(ErrorCodes.AUT_004)
                .message(message)
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(apiResponse);
    }

    /**
     * Handling Validation Error
     *
     * @param exception
     * @return
     */
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<BaseJsonResponse> handlingValidation(MethodArgumentNotValidException exception) {

        List<ValidationError> errors = exception.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> new ValidationError(fieldError.getField(),
                        fieldError.getDefaultMessage()))
                .collect(Collectors.toList());
        String message = messageSource.getMessage(ErrorCodes.COM_004, new Object[] {}, LocaleContextHolder.getLocale());

        BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                .status(StatusFlag.ERROR.getValue())
                .code(ErrorCodes.COM_004)
                .message(message)
                .result(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }

    /**
     * Handling Unsupported HTTP Method
     *
     * @param exception
     * @return
     */
    @ExceptionHandler(value = HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<BaseJsonResponse> handlingHttpRequestMethodNotSupported(
            HttpRequestMethodNotSupportedException exception) {
        String message = messageSource.getMessage(ErrorCodes.COM_002, null, LocaleContextHolder.getLocale());

        BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                .status(StatusFlag.ERROR.getValue())
                .code(ErrorCodes.COM_002)
                .message(message)
                .build();

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(apiResponse);
    }

    /**
     * Handling No Resource Found Exception
     *
     * @param exception
     * @return
     */
    @ExceptionHandler(value = NoResourceFoundException.class)
    public ResponseEntity<BaseJsonResponse> handlingNoResourceFoundException(NoResourceFoundException exception,
                                                                             HttpServletRequest request) {

        String notFoundPath = request.getRequestURI();
        String message = messageSource.getMessage(ErrorCodes.COM_005, null, LocaleContextHolder.getLocale());

        message = message + ": " + notFoundPath;

        BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                .status(StatusFlag.ERROR.getValue())
                .code(ErrorCodes.COM_005)
                .message(message)
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
    }

    /**
     * Handling HttpMessageNotReadableException
     *
     * @param exception
     * @return
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<BaseJsonResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException exception) {
        LogWrapper.error("Invalid request format: ", exception);
        String message = messageSource.getMessage(ErrorCodes.COM_006, null, LocaleContextHolder.getLocale());
        if (exception.getMessage().contains("Cannot deserialize value of type `boolean`")) {
            message = "The 'completed' field must be a boolean value (true/false)";
        }

        BaseJsonResponse apiResponse = BaseJsonResponse.builder()
                .status(StatusFlag.ERROR.getValue())
                .code(ErrorCodes.COM_006)
                .message(message)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }
}
