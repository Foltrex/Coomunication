package com.softarex.communication.service;

import com.softarex.communication.dao.UserDao;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.UserAlreadyExistException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

    public List<User> findAll() {
        return userDao.findAll();
    }

    public long count() {
        return userDao.count();
    }

    public void delete(User user) {
        userDao.delete(user);
    }


    public void register(User user) throws UserAlreadyExistException {
        Optional<User> userWithTheSameEmail = userDao.findByEmail(user.getEmail());
        if (userWithTheSameEmail.isPresent()) {
            throw new UserAlreadyExistException("User already exists for this email");
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);
        userDao.save(user);
    }

    public void save(User user) {
        if (user == null) {
            log.warn("User is null.");
            return;
        }

        userDao.save(user);
    }
}
