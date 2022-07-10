package com.softarex.communication.security.jwt;

import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider implements Serializable {
    @Value("$(jwt.secret)")
    private String jwtSecret;

    /**
     * Generates jsw token with login
     *
     * @return the generated login
     */
    public String generateToken(String login) {
        Date date = Date.from(LocalDate.now().plusDays(15).atStartOfDay(ZoneId.systemDefault()).toInstant());
        return Jwts.builder()
                .setSubject(login)
                .setExpiration(date)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            JwtParser parser = Jwts.parser();
            parser = parser.setSigningKey(jwtSecret);
            Jws<Claims> jws =  parser.parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            log.warn("invalid token");
        }
        return false;
    }


    public String getLoginFromToken(String token) {
        JwtParser parser = Jwts.parser();
        parser = parser.setSigningKey(jwtSecret);
        Jws<Claims> jws = parser.parseClaimsJws(token);
        Claims claims = jws.getBody();
        return claims.getSubject();
    }
}
