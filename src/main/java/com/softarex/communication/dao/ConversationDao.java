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

    long countByReceiver(User receiver);

    List<Conversation> findBySender(User sender);

    Page<Conversation> findBySender(User sender, Pageable pageable);

    List<Conversation> findByReceiver(User user);

    Page<Conversation> findByReceiver(User user, Pageable pageable);
}
