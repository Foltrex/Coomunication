package com.softarex.communication.service;

import com.softarex.communication.dao.ConversationDao;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.transaction.annotation.Propagation.REQUIRES_NEW;

@Service
@Slf4j
@Transactional(propagation = REQUIRES_NEW)
public class ConversationService {

    private final ConversationDao conversationDao;

    public ConversationService(ConversationDao conversationDao) {
        this.conversationDao = conversationDao;
    }

    public Optional<Conversation> findById(Long id) {
        return conversationDao.findById(id);
    }

    public List<Conversation> findQuestionsForUser(User user) {
        return conversationDao.findByReceiverIsNot(user);
    }

    public long countForUser(User user) {
        return conversationDao.countBySender(user);
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

    public List<Conversation> findPaginatedQuestionsForUser(User user, int pageNo, int pageSize) {
        Pageable paging = PageRequest.of(pageNo, pageSize);
        Page<Conversation> pageResult = conversationDao.findByReceiverIsNot(user, paging);

        return pageResult.hasContent() ? pageResult.getContent() : Collections.emptyList();
    }


}
