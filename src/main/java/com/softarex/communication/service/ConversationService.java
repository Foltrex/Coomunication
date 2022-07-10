package com.softarex.communication.service;

import com.softarex.communication.dao.ConversationDao;
import com.softarex.communication.domain.Answer;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.ConversationServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Stream;

import static org.springframework.transaction.annotation.Propagation.REQUIRES_NEW;

@Slf4j
@Service
@Transactional(propagation = REQUIRES_NEW)
public class ConversationService {

    private final ConversationDao conversationDao;

    public ConversationService(ConversationDao conversationDao) {
        this.conversationDao = conversationDao;
    }

    public Conversation findById(Long id) throws ConversationServiceException {
        return conversationDao.findById(id).orElseThrow(ConversationServiceException::new);
    }

    public Page<Conversation> findQuestionsFromUser(User user) {
        int firstPage = 0;
        int maxPageSize = Integer.MAX_VALUE;
        Pageable paging = PageRequest.of(firstPage, maxPageSize);
        return conversationDao.findBySender(user, paging);
    }

    public Page<Conversation> findPaginatedQuestionsFromUser(User user, int pageNo, int pageSize) {
        Pageable paging = PageRequest.of(pageNo, pageSize);
        return conversationDao.findBySender(user, paging);
    }

    public Page<Conversation> findAnswersFromUser(User user) {
        int firstPage = 0;
        int maxPageSize = Integer.MAX_VALUE;
        Pageable paging = PageRequest.of(firstPage, maxPageSize);
        return conversationDao.findByReceiver(user, paging);
    }

    public Page<Conversation> findPaginatedAnswersFromUser(User user, int pageNo, int pageSize) {
        Pageable paging = PageRequest.of(pageNo, pageSize);
        return conversationDao.findByReceiver(user, paging);
    }

    public List<String> findAllAnswerTypes() {
        return Stream.of(Answer.Type.values())
                .map(Answer.Type::getType)
                .toList();
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
