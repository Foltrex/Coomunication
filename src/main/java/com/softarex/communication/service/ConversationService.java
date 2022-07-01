package com.softarex.communication.service;

import com.softarex.communication.dao.ConversationDao;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.ConversationServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
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

    public Conversation findById(Long id) throws ConversationServiceException {
        return conversationDao.findById(id).orElseThrow(ConversationServiceException::new);
    }

    public List<Conversation> findQuestionsFromUser(User user) {
        return conversationDao.findBySender(user);
    }

    public List<Conversation> findPaginatedQuestionsFromUser(User user, int pageNo, int pageSize) {
        Pageable paging = PageRequest.of(pageNo, pageSize);
        Page<Conversation> pageResult = conversationDao.findBySender(user, paging);

        return pageResult.hasContent() ? pageResult.getContent() : Collections.emptyList();
    }

    public List<Conversation> findAnswersFromUser(User user) {
        return conversationDao.findByReceiver(user);
    }

    public List<Conversation> findPaginatedAnswersFromUser(User user, int pageNo, int pageSize) {
        Pageable paging = PageRequest.of(pageNo, pageSize);
        Page<Conversation> pageResult = conversationDao.findByReceiver(user, paging);

        return pageResult.hasContent() ? pageResult.getContent() : Collections.emptyList();
    }

    public long countQuestionsFromUser(User user) {
        return conversationDao.countBySender(user);
    }

    public long countAnswersFromUser(User user) {
        return conversationDao.countByReceiver(user);
    }

    public void delete(Conversation conversation) {
        conversationDao.delete(conversation);
    }

    public Conversation save(Conversation conversation) {
        if (conversation == null) {
            log.warn("Conversation is null.");
            return null;
        }

        return conversationDao.save(conversation);
    }

}
