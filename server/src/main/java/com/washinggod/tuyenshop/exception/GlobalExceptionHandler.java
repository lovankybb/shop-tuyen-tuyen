package com.washinggod.tuyenshop.exception;

import com.washinggod.tuyenshop.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Catch-all for unexpected exceptions
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse<Void>> handlingRuntimeException(Exception exception) {
        log.error("Uncategorized Exception: ", exception);
        
        ApiResponse<Void> apiResponse = new ApiResponse<>();
        apiResponse.setCode(9999); // Generic error code
        apiResponse.setMessage(exception.getMessage());
        
        return ResponseEntity.internalServerError().body(apiResponse);
    }

    // 2. Catch custom AppExceptions
    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse<Void>> handlingAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse<Void> apiResponse = new ApiResponse<>();

        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiResponse);
    }

    // 3. Catch validation errors from DTOs (@Valid)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handlingValidation(MethodArgumentNotValidException exception) {
        String enumKey = exception.getFieldError().getDefaultMessage();
        ApiResponse<Void> apiResponse = new ApiResponse<>();
        apiResponse.setCode(400); // Standard bad request code

        try {
            // Try to map the validation message (e.g. "INVALID_PASSWORD") to an ErrorCode enum
            ErrorCode errorCode = ErrorCode.valueOf(enumKey);
            apiResponse.setMessage(errorCode.name()); // Or errorCode.getMessage()
        } catch (IllegalArgumentException e) {
            // If the message isn't an enum key, just return the string directly
            apiResponse.setMessage(enumKey);
        }

        return ResponseEntity.badRequest().body(apiResponse);
    }
}