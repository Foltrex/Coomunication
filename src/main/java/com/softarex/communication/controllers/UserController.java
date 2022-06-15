package com.softarex.communication.controllers;

import com.softarex.communication.domain.User;
import com.softarex.communication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class UserController {
    private static String MAIN_PAGE = "main";

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public String registerUser(User user) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(user.getPassword());

        User userWithEncodedPassword = User.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .password(encodedPassword)
                .build();

        userService.save(userWithEncodedPassword);

        return MAIN_PAGE;
    }
}
