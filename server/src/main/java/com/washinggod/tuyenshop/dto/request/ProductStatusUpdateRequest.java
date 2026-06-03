package com.washinggod.tuyenshop.dto.request;

import com.washinggod.tuyenshop.enums.ProductStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductStatusUpdateRequest {
    @NotNull(message = "Product status must not be null")
    ProductStatus status;
}

