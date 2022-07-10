package com.softarex.communication.dao;

import com.softarex.communication.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDao extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByEmailIsNot(String email);

    List<User> findByIdIsNot(Long id);
}
