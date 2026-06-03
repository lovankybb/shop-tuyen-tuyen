package com.washinggod.tuyenshop.dto.response;

import com.washinggod.tuyenshop.enums.ProductStatus;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    Long id;
    String name;
    BigDecimal price;
    BigDecimal salePrice;
    String description;
    String brand;
    String category;
    ProductStatus status;
    String slug;
    List<String> images;
    Instant createdAt;
    Instant updatedAt;
}
