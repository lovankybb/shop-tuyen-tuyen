package com.washinggod.tuyenshop.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemRequest {
    @NotNull(message = "Product variant ID is required")
    Long productVariantId;

    @Min(value = 1, message = "Quantity must be at least 1")
    Integer quantity;
}