package com.washinggod.tuyenshop.configuration.properties;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MomoProperties {

    @Value("${momo.partner-code}")
    String partnerCode;

    @Value("${momo.access-key}")
    String accessKey;

    @Value("${momo.secret-key}")
    String secretKey;

    @Value("${momo.return-url}")
    String returnUrl;

    @Value("${momo.notify-url}")
    String notifyUrl;

    @Value("${momo.api-url}")
    String apiUrl;
}
