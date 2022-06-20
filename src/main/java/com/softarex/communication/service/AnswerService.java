package com.softarex.communication.service;

import com.softarex.communication.dao.AnswerDao;
import com.softarex.communication.domain.Answer;
import com.softarex.communication.domain.Conversation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.transaction.annotation.Propagation.REQUIRES_NEW;

@Service
@Slf4j
@Transactional(propagation = REQUIRES_NEW)
public class AnswerService {

    private final AnswerDao answerDao;

    public AnswerService(AnswerDao answerDao) {
        this.answerDao = answerDao;
    }

    public void save(Answer answer) {
        if (answer == null) {
            log.warn("Answer is null.");
            return;
        }

        answerDao.save(answer);
    }
}
