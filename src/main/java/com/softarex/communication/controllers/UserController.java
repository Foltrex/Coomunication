package com.softarex.communication.controllers;

import com.softarex.communication.domain.User;
import com.softarex.communication.exception.UserAlreadyExistException;
import com.softarex.communication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;

@Controller
public class UserController {
    private static String REGISTRATION_PAGE = "registration";
    private static String HOME_PAGE = "conversations";


    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/registration")
    public String registerUser(Model model) {
        model.addAttribute("user", new User());
        return REGISTRATION_PAGE;
    }

    @PostMapping("/registration")
    public String registerUser(@Valid @ModelAttribute("user") User user, BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("user", user);
            return REGISTRATION_PAGE;
        }

        try {
            userService.register(user);
        } catch (UserAlreadyExistException e) {
            bindingResult.rejectValue("email", "user.email", "An account already exists for this email.");
            model.addAttribute("user", user);
            return REGISTRATION_PAGE;
        }

        return "redirect:/";
    }
}
