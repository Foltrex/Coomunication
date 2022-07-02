package com.softarex.communication.controllers;

import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.ConversationServiceException;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.service.ConversationService;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class QuestionsController {
    private static final String QUESTIONS_PAGE = "questions";
    private static final Integer ALL_RECORDS_PER_PAGE = -1;

    private final ConversationService conversationService;

    public QuestionsController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @GetMapping("/questions")
    public List<Conversation> findAll() throws UserServiceException {
        // User currentLoggedUser = userService.findByEmail(loggedUser.getName());
        // return conversationService.findQuestionsFromUser(currentLoggedUser);
        return conversationService.findAll();
    }

    @PostMapping("/question/save")
    public Conversation save(@Payload Conversation conversation) {
        return conversationService.save(conversation);
    }
}
