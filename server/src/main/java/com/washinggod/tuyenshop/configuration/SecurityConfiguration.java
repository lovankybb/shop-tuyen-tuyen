package com.washinggod.tuyenshop.configuration;

import com.washinggod.tuyenshop.configuration.properties.JwtConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    private final  String [] PUBLIC_ENDPOINT = {"/**"};

    @Value("app.sec.cors.end-point")
    private String corsEndpoint;


    @Bean
    SecurityFilterChain filterChain(HttpSecurity http, JwtDecoder jwtDecoder) throws Exception {

        http.authorizeHttpRequests(
                auth -> {
                    auth.requestMatchers(PUBLIC_ENDPOINT)
                            .permitAll()
                            .requestMatchers(HttpMethod.OPTIONS)
                            .permitAll()
                            .anyRequest()
                            .authenticated();
                });

        http.csrf(AbstractHttpConfigurer::disable);

        http.cors(Customizer.withDefaults());

        http.oauth2ResourceServer(
                oauth2 -> {
                    oauth2.jwt(
                            jwtConfigurer -> {
                                jwtConfigurer
                                        .decoder(jwtDecoder)
                                        .jwtAuthenticationConverter(this.jwtAuthenticationConverter());
                            });
                });

        return http.build();
    }

    //    config jwt authentication converter
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter =
                new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    CorsFilter corsFilter() {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedHeader("*"); // allow header
        configuration.addAllowedMethod("*"); // allow method
        configuration.addAllowedOrigin(corsEndpoint); // allow frontend
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource =
                new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    JwtConfig jwtConfig() {
        return new JwtConfig();
    }
}

