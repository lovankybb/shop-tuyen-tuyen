package com.washinggod.tuyenshop.configuration.properties;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JwtConfig {

    @Value("${jwt.secret-key}")
    String secretKey;

    @Value("${jwt.valid-duration}")
    Long validDuration;

    @Value("${jwt.refreshable}")
    Long refreshable;
}
