package com.washinggod.tuyenshop.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.washinggod.tuyenshop.configuration.CustomJwtDecoder;
import com.washinggod.tuyenshop.configuration.properties.JwtConfig;
import com.washinggod.tuyenshop.dto.request.AuthenticationRequest;
import com.washinggod.tuyenshop.dto.request.IntrospectRequest;
import com.washinggod.tuyenshop.dto.request.RefreshTokenRequest;
import com.washinggod.tuyenshop.dto.response.AuthenticationResponse;
import com.washinggod.tuyenshop.dto.response.IntrospectResponse;
import com.washinggod.tuyenshop.entity.User;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import com.washinggod.tuyenshop.repository.UserRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtConfig jwtConfig;
    RedisTemplate<String, Object> redisTemplate;
    CustomJwtDecoder customJwtDecoder;
    MACSigner macSigner;

    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtConfig jwtConfig, RedisTemplate<String, Object> redisTemplate, CustomJwtDecoder customJwtDecoder) throws KeyLengthException {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtConfig = jwtConfig;
        this.redisTemplate = redisTemplate;
        this.customJwtDecoder = customJwtDecoder;
        this.macSigner = new MACSigner(jwtConfig.getSecretKey().getBytes());
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean isValid = true;
        try {
            customJwtDecoder.verifyToken(token, false);
        } catch (Exception e) {
            isValid = false;
        }
        return IntrospectResponse.builder().valid(isValid).build();
    }

    public void logout(String token) throws ParseException, JOSEException {
        var signedToken = customJwtDecoder.verifyToken(token, true);
        String jit = signedToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedToken.getJWTClaimsSet().getExpirationTime();

        redisTemplate.opsForValue().set(jit, "logged_out", expiryTime.getTime() - Instant.now().toEpochMilli(), TimeUnit.MILLISECONDS);
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest request) throws ParseException, JOSEException {
        var signedToken = customJwtDecoder.verifyToken(request.getToken(), true);
        var jit = signedToken.getJWTClaimsSet().getJWTID();
        var expiryTime = signedToken.getJWTClaimsSet().getExpirationTime();

        redisTemplate.opsForValue().set(jit, "logged_out", expiryTime.getTime() - Instant.now().toEpochMilli(), TimeUnit.MILLISECONDS);

        var username = signedToken.getJWTClaimsSet().getSubject();
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        // Convert roles to a comma-separated string for JWT scope
        String scope = user.getRoles().stream()
                .map(role -> "SCOPE_" + role.getName())
                .reduce((r1, r2) -> r1 + " " + r2)
                .orElse("SCOPE_USER");

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("tuyenshop.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(jwtConfig.getValidDuration(), ChronoUnit.DAYS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", scope)
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(macSigner);
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }
}
