package com.softarex.communication.controllers;

import com.softarex.communication.domain.Answer;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.ConversationServiceException;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.service.ConversationService;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Collections;
import java.util.List;

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
    public Page<Conversation> findQuestions(@RequestParam(defaultValue = "0") Integer pageNo,
                                            @RequestParam(defaultValue = "-1") Integer pageSize,
                                            Principal loggedUser) throws UserServiceException {

        User user = userService.findByEmail(loggedUser.getName());
        return pageSize.equals(ALL_RECORDS_PER_PAGE)
                ? conversationService.findQuestionsFromUser(user)
                : conversationService.findPaginatedQuestionsFromUser(user, pageNo, pageSize);
    }

    @GetMapping("/conversations/{id}")
    public Conversation findById(@PathVariable Long id) throws ConversationServiceException {
        return conversationService.findById(id);
    }

    @GetMapping("/answers")
    public Page<Conversation> findAnswers(@RequestParam(defaultValue = "0") Integer pageNo,
                                          @RequestParam(defaultValue = "-1") Integer pageSize,
                                          Principal loggedUser) throws UserServiceException {

        User user = userService.findByEmail(loggedUser.getName());
        return pageSize.equals(ALL_RECORDS_PER_PAGE)
                ? conversationService.findAnswersFromUser(user)
                : conversationService.findPaginatedAnswersFromUser(user, pageNo, pageSize);
    }

    @GetMapping("/answer/types")
    public List<String> findAllAnswerTypes() {
        return conversationService.findAllAnswerTypes();
    }

    @PostMapping("/conversation/save")
    public Conversation save(@RequestBody Conversation conversation) throws UserServiceException {
        User conversationSender = conversation.getSender();
        String senderEmail = conversationSender.getEmail();
        User sender = userService.findByEmail(senderEmail);

        User conversationReceiver = conversation.getReceiver();
        Long receiverId = conversationReceiver.getId();
        User receiver = userService.findById(receiverId);

        conversation.setSender(sender);
        conversation.setReceiver(receiver);

        return conversationService.save(conversation);
    }
}
