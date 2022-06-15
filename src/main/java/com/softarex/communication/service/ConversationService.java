package com.softarex.communication.service;

import com.softarex.communication.dao.ConversationDao;
import com.softarex.communication.dao.UserDao;
import com.softarex.communication.domain.Conversation;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@Transactional
public class ConversationService {

    private final ConversationDao conversationDao;

    public ConversationService(ConversationDao conversationDao) {
        this.conversationDao = conversationDao;
    }

    public List<Conversation> findAll() {
        return conversationDao.findAll();
    }

    public long count() {
        return conversationDao.count();
    }

    public void delete(Conversation conversation) {
        conversationDao.delete(conversation);
    }

    public void save(Conversation conversation) {
        if (conversation == null) {
            log.warn("Conversation is null.");
            return;
        }

        conversationDao.save(conversation);
    }
}
