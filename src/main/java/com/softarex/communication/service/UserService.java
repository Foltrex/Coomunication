package com.softarex.communication.service;

import com.softarex.communication.dao.UserDao;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.UserServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.springframework.transaction.annotation.Propagation.REQUIRES_NEW;

@Service
@Slf4j
@Transactional(propagation = REQUIRES_NEW)
public class UserService {
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public Optional<User> findById(Long id) {
        return userDao.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userDao.findByEmail(email);
    }

    public Optional<User> findByEmailAndPassword(String email, String password) {
        Optional<User> userWithThisEmailOptional = userDao.findByEmail(email);
        User userWithThisEmail = userWithThisEmailOptional.orElse(new User());
        return passwordEncoder.matches(password, userWithThisEmail.getPassword()) ? userWithThisEmailOptional : Optional.empty();
    }

    public List<User> findAll() {
        return userDao.findAll();
    }

    public List<User> findByEmailIsNot(String email) {
        return userDao.findByEmailIsNot(email);
    }

    public long count() {
        return userDao.count();
    }

    public void delete(User user) {
        userDao.delete(user);
    }


    public User register(User user) throws UserServiceException {
        Optional<User> userWithTheSameEmail = userDao.findByEmail(user.getEmail());
        if (userWithTheSameEmail.isPresent()) {
            throw new UserServiceException("User already exists for this email");
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);
        return userDao.save(user);
    }

    public User save(User user) throws UserServiceException {
        if (user == null) {
            throw new UserServiceException("User is null");
        }

        return userDao.save(user);
    }
}
