package com.softarex.communication.controllers;

import com.softarex.communication.domain.Answer;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.ConversationServiceException;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.service.ConversationService;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class ConversationsController {
    private static final Integer ALL_RECORDS_PER_PAGE = -1;

    private final ConversationService conversationService;
    private final UserService userService;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public ConversationsController(ConversationService conversationService, UserService userService, SimpMessagingTemplate simpMessagingTemplate) {
        this.conversationService = conversationService;
        this.userService = userService;
        this.simpMessagingTemplate = simpMessagingTemplate;
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

    @GetMapping("/answers")
    public Page<Conversation> findAnswers(@RequestParam(defaultValue = "0") Integer pageNo,
                                          @RequestParam(defaultValue = "-1") Integer pageSize,
                                          Principal loggedUser) throws UserServiceException {

        User user = userService.findByEmail(loggedUser.getName());
        return pageSize.equals(ALL_RECORDS_PER_PAGE)
                ? conversationService.findAnswersFromUser(user)
                : conversationService.findPaginatedAnswersFromUser(user, pageNo, pageSize);
    }

    @GetMapping("/conversations/{id}")
    public Conversation findById(@PathVariable Long id) throws ConversationServiceException {
        return conversationService.findById(id);
    }

    @GetMapping("/answer/types")
    public List<String> findAllAnswerTypes() {
        return conversationService.findAllAnswerTypes();
    }


    @MessageMapping("/conversation/delete")
    public void delete(@Payload Conversation conversation) throws ConversationServiceException {
        conversationService.delete(conversation);

        User receiver = conversation.getReceiver();
        String receiverEmail = receiver.getEmail();
        simpMessagingTemplate.convertAndSend("/topic/answer/delete/" + receiverEmail, conversation);

        User sender = conversation.getSender();
        String senderEmail = sender.getEmail();
        simpMessagingTemplate.convertAndSend("/topic/question/delete/" + senderEmail, conversation);
    }

    @MessageMapping("/conversation/save")
    public void saveQuestion(@Payload Conversation conversation) throws UserServiceException {
        User receiver = conversation.getReceiver();
        String receiverEmail = receiver.getEmail();
        receiver = userService.findByEmail(receiverEmail);

        User sender = conversation.getSender();
        String senderEmail = sender.getEmail();
        sender = userService.findByEmail(senderEmail);

        conversation.setSender(sender);
        conversation.setReceiver(receiver);

        Conversation savedConversation = conversationService.save(conversation);

        simpMessagingTemplate.convertAndSend("/topic/answer/save/" + receiverEmail, savedConversation);
        simpMessagingTemplate.convertAndSend("/topic/question/save/" + senderEmail, savedConversation);
    }
}
