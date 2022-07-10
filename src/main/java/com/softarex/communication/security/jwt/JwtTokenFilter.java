package com.softarex.communication.security.jwt;

import com.softarex.communication.security.MessengerUserDetails;
import com.softarex.communication.security.MessengerUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Component
public class JwtTokenFilter extends GenericFilterBean {
    public static final String AUTHORIZATION = "Authorization";

    private final JwtTokenProvider jwtProvider;
    private final MessengerUserDetailsService messengerUserDetailsService;

    @Autowired
    public JwtTokenFilter(JwtTokenProvider jwtProvider, MessengerUserDetailsService messengerUserDetailsService) {
        this.jwtProvider = jwtProvider;
        this.messengerUserDetailsService = messengerUserDetailsService;
    }

    /** Checks and validate token in request header and and map token to user if token's correct */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String token = request.getHeader(AUTHORIZATION);
        if (token != null && jwtProvider.validateToken(token)) {
            String userLogin = jwtProvider.getLoginFromToken(token);

            MessengerUserDetails customUserDetails = messengerUserDetailsService.loadUserByUsername(userLogin);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);

            // set authorization token for all response
            response.setHeader(AUTHORIZATION, token);
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
