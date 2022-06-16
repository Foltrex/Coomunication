package com.softarex.communication.security;

import com.softarex.communication.dao.UserDao;
import com.softarex.communication.domain.User;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

        Optional<User> userOptional = userService.findByEmail(userName);
        userOptional.orElseThrow(() -> new UsernameNotFoundException("Not found: " + userName));

        return new MessengerUserDetails(userOptional.get());
    }
}
