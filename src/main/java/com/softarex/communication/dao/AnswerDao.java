package com.softarex.communication.dao;

import com.softarex.communication.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerDao extends JpaRepository<Answer, Long> {
}
