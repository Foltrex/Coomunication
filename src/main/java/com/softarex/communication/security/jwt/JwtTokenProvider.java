package com.softarex.communication.security.jwt;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.Serializable;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider implements Serializable {
    private static final long serialVersionUID = 2569800841756370596L;

    @Value("${jwt.secret}")
    private String secretKey;

    private final UserDetailsService userDetailsService;

    public JwtTokenProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostConstruct
    protected void init() {
        Base64.Encoder encoder = Base64.getEncoder();
        secretKey = encoder.encodeToString(secretKey.getBytes());
    }

    public String createToken(String username) {
        Date now = new Date();
        long validityInMilliseconds = 50 * 60 * 60;

        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(now.getTime() + validityInMilliseconds))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public Authentication getAuthentication(String username) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities());
    }

    public Claims getClaimsFromToken(String token) {
        JwtParser parser = Jwts.parser();
        parser = parser.setSigningKey(secretKey);
        Jws<Claims> jws = parser.parseClaimsJws(token);
        return jws.getBody();
    }
}
