package com.softarex.communication.controllers;

import com.softarex.communication.domain.User;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.security.jwt.JwtTokenProvider;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.List;

@RestController
@Slf4j
public class UserController {
    public static final String AUTHORIZATION_HEADER = "Authorization";

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/user/login")
    public String login(@RequestBody User user, HttpServletResponse response) throws UserServiceException {
        User loggedUser = userService.findByEmail(user.getEmail());

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        String tokenValue = tokenProvider.generateToken(user.getEmail());
        response.setHeader(AUTHORIZATION_HEADER, tokenValue);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("name", loggedUser.getName());
        jsonObject.put("surname", loggedUser.getSurname());
        jsonObject.put("email", loggedUser.getEmail());
        jsonObject.put("token", tokenValue);

        return jsonObject.toString();
    }

    @GetMapping("/users")
    public List<User> findByUserIsNot(Principal loggedUser) throws UserServiceException {
        User currentLoggedUser = userService.findByEmail(loggedUser.getName());
        return userService.findByUserIsNot(currentLoggedUser);
    }

    @GetMapping("/users/{email}")
    public User findByUser(@PathVariable String email) throws UserServiceException {
        log.info(email);
        return userService.findByEmail(email);
    }

    @PutMapping("/users")
    public User update(@RequestBody User user) throws UserServiceException {
        return userService.save(user);
    }
}
