package com.washinggod.tuyenshop.configuration.properties;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class RedisProperties {

    @Value("${spring.data.redis.url}")
    private String url;
}
