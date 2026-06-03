package com.washinggod.tuyenshop.dto.request;

import com.washinggod.tuyenshop.enums.ProductStatus;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequest {
    String name;
    BigDecimal price;
    BigDecimal salePrice;
    String description;
    Long brandId;
    Long categoryId;
    ProductStatus status;
    String slug;
}
