package com.softarex.communication.dao;

import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationDao extends JpaRepository<Conversation, Long> {
    long countBySender(User sender);

    List<Conversation> findByReceiverIsNot(User receiver);

    List<Conversation> findBySenderIsNot(User sender);

    Page<Conversation> findByReceiverIsNot(User receiver, Pageable pageable);

    Page<Conversation> findBySenderIsNot(User sender, Pageable pageable);
}
