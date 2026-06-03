package com.washinggod.tuyenshop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    Long id;
    Long productVariantId;
    String productName;
    String colorName;
    String versionName;
    BigDecimal price;
    Integer quantity;
}