package com.washinggod.tuyenshop.exception;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    
    // Generic Errors
    ENTITY_NOT_FOUND(1002, "Entity not found", HttpStatus.NOT_FOUND),
    VALIDATION_ERROR(1003, "Validation error", HttpStatus.BAD_REQUEST),
    ENTITY_EXISTED(1004, "Entity already existed", HttpStatus.BAD_REQUEST),

    // User Errors
    USER_EXISTED(1005, "User existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1006, "User not found", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1007, "Unauthenticated", HttpStatus.UNAUTHORIZED),

    // Brand Errors
    BRAND_NOT_FOUND(2001, "Brand not found", HttpStatus.NOT_FOUND),
    BRAND_NAME_NOT_EMPTY(2002, "Brand name must not be empty", HttpStatus.BAD_REQUEST),

    // Category Errors
    CATEGORY_NOT_FOUND(3001, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_NAME_NOT_EMPTY(3002, "Category name must not be empty", HttpStatus.BAD_REQUEST),
    CATEGORY_SLUG_NOT_EMPTY(3003, "Category slug must not be empty", HttpStatus.BAD_REQUEST),

    // Color Errors
    COLOR_NOT_FOUND(4001, "Color not found", HttpStatus.NOT_FOUND),
    COLOR_NAME_NOT_EMPTY(4002, "Color name must not be empty", HttpStatus.BAD_REQUEST),
    COLOR_HEX_NOT_EMPTY(4003, "Color hex must not be empty", HttpStatus.BAD_REQUEST),

    // Version Errors
    VERSION_NOT_FOUND(5001, "Version not found", HttpStatus.NOT_FOUND),
    VERSION_NAME_NOT_EMPTY(5002, "Version name must not be empty", HttpStatus.BAD_REQUEST),

    // Order Errors
    PRODUCT_VARIANT_NOT_FOUND(6001, "Product variant not found", HttpStatus.NOT_FOUND),
    PRODUCT_OUT_OF_STOCK(6002, "Product is out of stock", HttpStatus.BAD_REQUEST)
    ;

    int code;
    String message;
    HttpStatus statusCode;
}