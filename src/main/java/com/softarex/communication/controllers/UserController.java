package com.softarex.communication.controllers;

import com.softarex.communication.domain.User;
import com.softarex.communication.exception.UserAlreadyExistException;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;

@Controller
@Slf4j
public class UserController {
    private static String REGISTRATION_PAGE = "registration";


    private final UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/registration")
    public String registerUser(Model model) {
        model.addAttribute("user", new User());
        return REGISTRATION_PAGE;
    }

    @PostMapping("/registration")
    public String registerUser(@Valid @ModelAttribute("user") User user, BindingResult bindingResult, Model model) {
        log.info("almost registerd user: " + user.toString());

        if (bindingResult.hasErrors() || isEmptyUser(user)) {
            model.addAttribute("user", user);
            return REGISTRATION_PAGE;
        }

        try {
            userService.register(user);
        } catch (UserAlreadyExistException e) {
            log.warn(e.getMessage());
            bindingResult.rejectValue("email", "user.email", "An account already exists for this email.");
            model.addAttribute("user", user);
            return REGISTRATION_PAGE;
        }

        return "redirect:/";
    }


    private boolean isEmptyUser(User user) {
        return new User().equals(user);
    }
}
