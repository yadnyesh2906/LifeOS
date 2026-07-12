package com.lifeos.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    // Change this to a long random string later
    private static final String SECRET_KEY =
            "LifeOSSecretKeyLifeOSSecretKeyLifeOSSecretKey123456";

    // 24 Hours
    private static final long EXPIRATION =
            1000 * 60 * 60 * 24;

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String extractEmail(String token) {

        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public boolean isTokenValid(String token) {

        try {

            extractEmail(token);

            return true;

        } catch (Exception e) {

            System.out.println("================================");
            System.out.println("JWT ERROR: " + e.getClass().getSimpleName());
            System.out.println("JWT MESSAGE: " + e.getMessage());
            System.out.println("================================");

            return false;
        }
    }
}