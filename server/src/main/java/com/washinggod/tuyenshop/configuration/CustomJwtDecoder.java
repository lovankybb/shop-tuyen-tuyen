package com.washinggod.tuyenshop.configuration;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;
import com.washinggod.tuyenshop.configuration.properties.JwtConfig;
import com.washinggod.tuyenshop.exception.AppException;
import com.washinggod.tuyenshop.exception.ErrorCode;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class CustomJwtDecoder implements JwtDecoder {

    private final JwtConfig jwtConfig;
    private final RedisTemplate<String, Object> redisTemplate;
    private final JWSVerifier verifier;

    public CustomJwtDecoder(JwtConfig jwtConfig, RedisTemplate<String, Object> redisTemplate) {
        this.jwtConfig = jwtConfig;
        this.redisTemplate = redisTemplate;
        try {
            this.verifier = new MACVerifier(jwtConfig.getSecretKey().getBytes());
        } catch (com.nimbusds.jose.JOSEException e) {
            throw new IllegalArgumentException("Invalid JWT secret key length. It must be at least 256 bits (32 bytes).", e);
        }
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        try {
            // For incoming API requests, we are always validating an access token, not a refresh token.
            SignedJWT signedJWT = verifyToken(token, false);

            // Convert to Spring Security's Jwt object
            return new Jwt(
                    token,
                    signedJWT.getJWTClaimsSet().getIssueTime().toInstant(),
                    signedJWT.getJWTClaimsSet().getExpirationTime().toInstant(),
                    signedJWT.getHeader().toJSONObject(),
                    signedJWT.getJWTClaimsSet().getClaims()
            );
        } catch (JOSEException | ParseException | AppException e) {
            // If any validation fails, wrap it in JwtException as required by the interface
            throw new JwtException("Invalid Token", e);
        }
    }

    /**
     * Verifies the token's signature, expiration, and checks against the Redis denylist.
     * This method can be shared with other services that need to validate a token.
     *
     * @param token The JWT string.
     * @param isRefresh Whether to validate this token using the refreshable duration.
     * @return The parsed and verified SignedJWT object.
     * @throws JOSEException if the signature is invalid.
     * @throws ParseException if the token string is malformed.
     * @throws AppException if the token is expired or has been logged out.
     */
    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = isRefresh
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(jwtConfig.getRefreshable(), ChronoUnit.DAYS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        // Check signature and expiration
        if (!(verified && expiryTime.after(new Date()))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Check if token has been logged out (is in Redis denylist)
        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        if (Boolean.TRUE.equals(redisTemplate.hasKey(jit))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }
}
