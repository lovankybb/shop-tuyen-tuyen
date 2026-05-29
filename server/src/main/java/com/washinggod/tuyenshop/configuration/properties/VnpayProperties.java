package com.washinggod.tuyenshop.configuration.properties;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VnpayProperties {

    @Value("${vnpay.tmn-code}")
    String tmnCode;

    @Value("${vnpay.secret-key}")
    String secretKey;

    @Value("${vnpay.pay-url}")
    String payUrl;

    @Value("${vnpay.return-url}")
    String returnUrl;

    @Value("${vnpay.expire-time}")
    int expireTimeConfig;
}
