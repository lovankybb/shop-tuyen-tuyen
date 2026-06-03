package com.washinggod.tuyenshop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import java.util.Set;

@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRoleUpdateRequest {
    @NotBlank(message = "Roles must not be blank")
    Set<String> roleNames;
}