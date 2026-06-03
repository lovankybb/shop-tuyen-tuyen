package com.washinggod.tuyenshop.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BrandRequest {
    @NotEmpty(message = "BRAND_NAME_NOT_EMPTY")
    String name;
    String description;
    String logo;
}
