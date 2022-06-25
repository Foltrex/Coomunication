package com.softarex.communication.controllers;

import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.AuthitificatedUserException;
import com.softarex.communication.exception.ConversationServiceException;
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
@Controller
public class QuestionsController {
    private static final String QUESTIONS_PAGE = "questions";

    private static final Integer ALL_RECORDS_PER_PAGE = -1;

    private final ConversationService conversationService;
    private final UserService userService;

    private final SimpMessagingTemplate messagingTemplate;

    public QuestionsController(ConversationService conversationService, UserService userService,
                               SimpMessagingTemplate messagingTemplate) {
        this.conversationService = conversationService;
        this.userService = userService;

        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping(value = {"/questions", "/"})
    public String showPaginatedQuestions(Model model, @RequestParam(defaultValue = "0") Integer pageNo,
                                             @RequestParam(defaultValue = "-1") Integer pageSize, Principal loggedUser) throws AuthitificatedUserException {

        User currentLoggedUser = userService.findByEmail(loggedUser.getName()).orElseThrow(AuthitificatedUserException::new);

        List<Conversation> paginatedConversations = (pageSize.equals(ALL_RECORDS_PER_PAGE))
                ? conversationService.findQuestionsFromUser(currentLoggedUser)
                : conversationService.findPaginatedQuestionsFromUser(currentLoggedUser, pageNo, pageSize);

        model.addAttribute("conversations", paginatedConversations);


        long totalConversationAmount = conversationService.countQuestionsFromUser(currentLoggedUser);
        setAttributesForPagination(model, pageNo, pageSize, totalConversationAmount);

        return QUESTIONS_PAGE;
    }

    @GetMapping("/questions/users")
    @ResponseBody
    public List<User> getAllUsers(Principal loggedUser) {
        User currentLoggedUser = userService.findByEmail(loggedUser.getName()).orElseThrow(IllegalArgumentException::new);
        return userService.findByUserIsNot(currentLoggedUser);
    }

    @GetMapping(value = {"/questions/edit", "/questions/delete"})
    @ResponseBody
    public Conversation findQuestion(Long id) throws ConversationServiceException {
        return conversationService.findById(id);
    }



    @MessageMapping("/conversations/delete-question")
    public void deleteQuestion(Conversation conversation) throws ConversationServiceException {
        Conversation realConversation = conversationService.findById(conversation.getId());
        log.info("Delete conversation: " + realConversation);
        conversationService.delete(realConversation);

        Long receiverId = realConversation.getReceiver().getId();
        Long senderId = realConversation.getSender().getId();

        Conversation deletedConversation = new Conversation.Builder().id(realConversation.getId()).build();
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, deletedConversation);
        messagingTemplate.convertAndSend("/topic/messages/" + senderId, deletedConversation);
    }

    @MessageMapping(value = {"/conversations/add-question/{id}", "/conversations/edit-question/{id}"})
    public void saveQuestion(@DestinationVariable Long id, @Payload Conversation conversation, Principal loggedUser) {
        User sender = userService.findByEmail(loggedUser.getName()).orElseThrow(IllegalArgumentException::new);
        User receiver = userService.findById(id).orElseThrow(IllegalArgumentException::new);
        conversation.setSender(sender);
        conversation.setReceiver(receiver);

        log.info("Received conversation" + conversation);
        Conversation savedConversation = conversationService.save(conversation);
        messagingTemplate.convertAndSend("/topic/messages/" + id, savedConversation);
        messagingTemplate.convertAndSend("/topic/messages/" + sender.getId(), savedConversation);
    }


    private void setAttributesForPagination(Model model, int pageNo, int pageSize, long totalConversationAmount) {
        long pageAmount = 1;
        if (pageSize != ALL_RECORDS_PER_PAGE) {
            pageAmount = (long) Math.ceil((double) totalConversationAmount / pageSize);
        }

        model.addAttribute("pageNo", pageNo);
        model.addAttribute("pageSize", pageSize);

        model.addAttribute("conversationAmount", totalConversationAmount);
        model.addAttribute("pageAmounts", pageAmount);
    }
}
