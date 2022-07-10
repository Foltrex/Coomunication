package com.softarex.communication.controllers;

import com.softarex.communication.domain.User;
import com.softarex.communication.security.jwt.JwtTokenProvider;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.security.Principal;
import java.util.List;

@RestController
@Slf4j
public class UserController {
    public static final String AUTHORIZATION_HEADER = "Authorization";

    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public UserController(UserService userService, JwtTokenProvider tokenProvider) {
        this.userService = userService;
        this.tokenProvider = tokenProvider;
    }

    /**
     * Authenticates user
     *
     * @param user  the logging user
     * @param response  the Response object
     * @return the JSON with user parameters
     */
    @PostMapping("/user/login")
    public String login(@RequestBody User user, HttpServletResponse response) {
        User loggedUser = userService.findByEmail(user.getEmail());

        String tokenValue = tokenProvider.generateToken(user.getEmail());
        response.setHeader(AUTHORIZATION_HEADER, tokenValue);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("name", loggedUser.getName());
        jsonObject.put("surname", loggedUser.getSurname());
        jsonObject.put("email", loggedUser.getEmail());
        jsonObject.put("token", tokenValue);

        return jsonObject.toString();
    }

    /**
     * Registers user
     *
     * @param user  the registering user
     * @return the registered user
     */
    @PostMapping("/user/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    /**
     * Searches all app users except current logged in user
     *
     * @param loggedUser  the logged in user
     * @return the found users
     */
    @GetMapping("/users")
    public List<User> findByUserIsNot(Principal loggedUser) {
        User currentLoggedUser = userService.findByEmail(loggedUser.getName());
        return userService.findByUserIsNot(currentLoggedUser);
    }

    /**
     * Searches user by email address
     *
     * @param email  the user email address
     * @return the foumd user
     */
    @GetMapping("/users/{email}")
    public User findByUser(@PathVariable String email) {
        return userService.findByEmail(email);
    }

    /**
     * Updates logged in user
     *
     * @param user  the user with new field values
     * @return the updated user
     */
    @PutMapping("/users")
    public User update(@RequestBody User user) {
        return userService.save(user);
    }

    /**
     * Deletes logged user by his id
     *
     * @param id  the logged user id
     */
    @DeleteMapping("/user/delete/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
