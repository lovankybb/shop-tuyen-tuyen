package com.washinggod.tuyenshop.configuration;

import com.washinggod.tuyenshop.configuration.properties.MomoProperties;
import com.washinggod.tuyenshop.configuration.properties.VnpayProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentConfiguration {

    @Bean
    MomoProperties momoProperties() {
        return new MomoProperties();
    }

    @Bean
    VnpayProperties vnpayProperties() {
        return new VnpayProperties();
    }
}
