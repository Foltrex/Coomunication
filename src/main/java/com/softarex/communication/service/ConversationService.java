package com.softarex.communication.service;

import com.softarex.communication.dao.ConversationDao;
import com.softarex.communication.dao.UserDao;
import com.softarex.communication.domain.Conversation;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.springframework.transaction.annotation.Propagation.REQUIRES_NEW;

@Service
@Slf4j
@Transactional(propagation = REQUIRES_NEW)
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

    public List<Conversation> findPaginated(int pageNo, int pageSize) {
        Pageable paging = PageRequest.of(pageNo, pageSize);
        Page<Conversation> pageResult = conversationDao.findAll(paging);

        return pageResult.toList();
    }
}
