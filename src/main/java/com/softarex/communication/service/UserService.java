package com.softarex.communication.service;

import com.softarex.communication.dao.UserDao;
import com.softarex.communication.domain.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@Transactional
public class UserService {
    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
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

    public void save(User user) {
        if (user == null) {
            log.warn("User is null.");
            return;
        }

        userDao.save(user);
    }
}
