package com.softarex.communication.controllers;

import com.softarex.communication.domain.User;
import com.softarex.communication.exception.AuthitificatedUserException;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.security.MessengerUserDetails;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.security.Principal;
import java.util.Objects;
import java.util.Optional;

@Controller
@Slf4j
public class UserController {
    private static final String REDIRECT = "redirect:/";

    private static final String MAIN_PAGE = "conversations";
    private static final String REGISTRATION_PAGE = "registration";
    private static final String PROFILE_PAGE = "account";
    private static final String DELETE_ACCOUNT_PAGE = "delete-account";
    private static final String LOGIN_PAGE = "login";

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
        if (bindingResult.hasErrors() || isEmptyUser(user)) {
            model.addAttribute("user", user);
            return REGISTRATION_PAGE;
        }

        try {
            userService.register(user);
        } catch (UserServiceException e) {
            log.warn(e.getMessage());
            bindingResult.rejectValue("email", "user.email", "An account already exists for this email.");
            model.addAttribute("user", user);
            return REGISTRATION_PAGE;
        }

        return REDIRECT + MAIN_PAGE;
    }

    @GetMapping("/user/edit")
    public String editUser(Model model, Principal principal) throws AuthitificatedUserException {
        User loggedUser = userService.findByEmail(principal.getName()).orElseThrow(AuthitificatedUserException::new);
        model.addAttribute("user", loggedUser);

        return PROFILE_PAGE;
    }


    @PostMapping("/user/save")
    public String saveUser(@Valid @ModelAttribute("user") User userWithNewCredentials, @RequestParam String currentPassword,
                           @RequestParam String currentEmail, BindingResult bindingResult,
                           Model model, @AuthenticationPrincipal MessengerUserDetails loggedUser) {

        if (bindingResult.hasErrors()) {
            model.addAttribute("user", userWithNewCredentials);
            return PROFILE_PAGE;
        }

        Optional<User> userOptional = userService.findByEmailAndPassword(currentEmail, currentPassword);

        try {
            if (userOptional.isPresent()) {
                User userWithOldCredentials = userOptional.get();
                if (userWithNewCredentials.getPassword() == null || userWithNewCredentials.getPassword().isEmpty()) {
                    userWithNewCredentials.setPassword(userWithOldCredentials.getPassword());
                }

                userService.save(userWithNewCredentials);
                loggedUser.updateLoggedUser(userWithNewCredentials);
                return REDIRECT + MAIN_PAGE;
            } else {
                bindingResult.rejectValue("password", "user.password", "Invalid current password.");
                model.addAttribute("user", userWithNewCredentials);
                return PROFILE_PAGE;
            }
        } catch (UserServiceException e) {
            log.warn(e.getMessage());
            return REDIRECT + MAIN_PAGE;
        }
    }


    @GetMapping("/user/delete")
    public String showDeleteForm(Model model, Principal principal) throws AuthitificatedUserException {
        User loggedUser = userService.findByEmail(principal.getName()).orElseThrow(AuthitificatedUserException::new);
        model.addAttribute("user", loggedUser);
        return DELETE_ACCOUNT_PAGE;
    }

    @PostMapping("/user/delete")
    public String deleteUser(@Valid @ModelAttribute("user") User user, BindingResult bindingResult,
                             Model model, HttpServletRequest request) {

        if (bindingResult.hasErrors() || isEmptyUser(user)) {
            model.addAttribute("user", user);
            return DELETE_ACCOUNT_PAGE;
        }

        Optional<User> userOptional = userService.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if (userOptional.isPresent()) {
            userService.delete(userOptional.get());

            HttpSession session = request.getSession(false);
            if(session != null) {
                session.invalidate();
            }
            SecurityContextHolder.clearContext();

            return REDIRECT + LOGIN_PAGE;
        } else {
            bindingResult.rejectValue("password", "user.password", "Invalid password.");
            model.addAttribute("user", user);
            return DELETE_ACCOUNT_PAGE;
        }
    }

    private boolean isEmptyUser(User user) {
        return new User().equals(user);
    }
}
