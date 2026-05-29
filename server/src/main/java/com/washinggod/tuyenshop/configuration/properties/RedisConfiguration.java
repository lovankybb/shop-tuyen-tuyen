package com.washinggod.tuyenshop.configuration.properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RedisConfiguration {

    @Bean
    RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
