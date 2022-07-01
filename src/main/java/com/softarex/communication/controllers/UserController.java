package com.softarex.communication.controllers;

import com.softarex.communication.domain.User;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.security.MessengerUserDetails;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.security.Principal;

@Controller
@Slf4j
public class UserController {
    private static final String REDIRECT = "redirect:/";

    private static final String MAIN_PAGE = "questions";
    private static final String REGISTRATION_PAGE = "registration";
    private static final String PROFILE_PAGE = "account";
    private static final String DELETE_ACCOUNT_PAGE = "delete-account";
    private static final String LOGIN_PAGE = "login";

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping(value = "/user/login", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> login(@RequestBody User user) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        Authentication authentication = authenticationManager.authenticate(authenticationToken);

        JSONObject jsonObject = new JSONObject();
        if (authentication.isAuthenticated()) {
            String email = user.getEmail();
            String tokenValue = tokenProvider.createToken(user.getEmail());

            jsonObject.put("name", authentication.getName());
            jsonObject.put("authorities", authentication.getAuthorities());
            jsonObject.put("token", tokenValue);
        }

        return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
    }
//    @GetMapping("/login")
//    public String showLoginPage() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
//            return LOGIN_PAGE;
//        }
//
//        return REDIRECT;
//    }

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
    public String editUser(Model model, Principal principal) throws UserServiceException {
        User loggedUser = userService.findByEmail(principal.getName());
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

        User user = userService.findByEmailAndPassword(currentEmail, currentPassword);

        try {
            if (user != null) {
                if (userWithNewCredentials.getPassword() == null || userWithNewCredentials.getPassword().isEmpty()) {
                    userWithNewCredentials.setPassword(user.getPassword());
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
    public String showDeleteForm(Model model, Principal principal) throws UserServiceException {
        User loggedUser = userService.findByEmail(principal.getName());
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

        User deletedUser = userService.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if (deletedUser != null) {
            userService.delete(deletedUser);

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
        User emptyUser = new User();
        return emptyUser.equals(user);
    }
}
