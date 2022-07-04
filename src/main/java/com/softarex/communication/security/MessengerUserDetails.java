package com.softarex.communication.security;

import com.softarex.communication.domain.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

public class MessengerUserDetails implements UserDetails {
    private static final long serialVersionUID = 1L;

    private User user;

    public MessengerUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.asList(new SimpleGrantedAuthority("USER"));
    }

    public void updateLoggedUser(User user) {
        this.user.setEmail(user.getEmail());
        this.user.setName(user.getName());
        this.user.setSurname(user.getSurname());
        this.user.setPassword(user.getPassword());
        this.user.setPhoneNumber(user.getPhoneNumber());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getFullName() {
        String name = user.getName();
        String surname = user.getSurname();
        return String.format("%s %s", name, surname);
    }

    @Override
    public String toString() {
        return "MessengerUserDetails{" +
                "user=" + user +
                '}';
    }
}
