package com.washinggod.tuyenshop.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {
    @NotEmpty(message = "CATEGORY_NAME_NOT_EMPTY")
    String name;
    @NotEmpty(message = "CATEGORY_SLUG_NOT_EMPTY")
    String slug;
    String description;
}
