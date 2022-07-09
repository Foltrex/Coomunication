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

    Page<Conversation> findBySender(User sender, Pageable pageable);

    Page<Conversation> findByReceiver(User user, Pageable pageable);
}