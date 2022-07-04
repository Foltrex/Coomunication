package com.softarex.communication.controllers;

import com.softarex.communication.domain.Answer;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.service.ConversationService;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Stream;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class ConversationsController {
    private static final String QUESTIONS_PAGE = "questions";
    private static final Integer ALL_RECORDS_PER_PAGE = -1;

    private final ConversationService conversationService;
    private final UserService userService;

    public ConversationsController(ConversationService conversationService, UserService userService) {
        this.conversationService = conversationService;
        this.userService = userService;
    }

    @GetMapping("/questions")
    public List<Conversation> findQuestions(Principal loggedUser) throws UserServiceException {
        User currentLoggedUser = userService.findByEmail(loggedUser.getName());
        return conversationService.findQuestionsFromUser(currentLoggedUser);
    }

    @GetMapping("/answers")
    public List<Conversation> findAnswers(Principal loggedUser) throws UserServiceException {
        User currentLoggedUser = userService.findByEmail(loggedUser.getName());
        return conversationService.findAnswersFromUser(currentLoggedUser);
    }

    @PostMapping(value = {"question/save", "answer/save"})
    public Conversation save(@Payload Conversation conversation) {
        return conversationService.save(conversation);
    }

    @GetMapping("/answer/types")
    public List<String> findAllAnswerTypes() {
        return conversationService.findAllAnswerTypes();
    }
}
