package com.washinggod.tuyenshop.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VersionRequest {
    @NotEmpty(message = "VERSION_NAME_NOT_EMPTY")
    String name;
}
