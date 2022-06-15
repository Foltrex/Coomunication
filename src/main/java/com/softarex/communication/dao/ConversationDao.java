package com.softarex.communication.dao;

import com.softarex.communication.domain.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationDao extends JpaRepository<Conversation, Long> {
}
