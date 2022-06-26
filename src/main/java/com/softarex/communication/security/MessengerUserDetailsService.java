package com.softarex.communication.security;

import com.softarex.communication.domain.User;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MessengerUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public MessengerUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        log.info(String.format("Input email: %s", userName));

        User user = null;
        try {
            user = userService.findByEmail(userName);
        } catch (UserServiceException e) {
            throw new UsernameNotFoundException("Not found: " + userName);
        }

        return new MessengerUserDetails(user);
    }
}
