package com.washinggod.tuyenshop.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordUpdateRequest {
    
    @Size(min = 8, message = "INVALID_PASSWORD")
    String oldPassword;

    @Size(min = 8, message = "INVALID_PASSWORD")
    String newPassword;
}