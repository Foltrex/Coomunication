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
@Controller
@CrossOrigin(origins = "http://localhost:8080")
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


    // @GetMapping(value = {"/questions", "/"})
    // public String showPaginatedQuestions(Model model, @RequestParam(defaultValue = "0") Integer pageNo,
    //                                          @RequestParam(defaultValue = "-1") Integer pageSize, Principal loggedUser) throws UserServiceException {

    //     User currentLoggedUser = userService.findByEmail(loggedUser.getName());

    //     model.addAttribute("pageNo", pageNo);
    //     model.addAttribute("pageSize", pageSize);
    //     model.addAttribute("loggedUser", currentLoggedUser);

    //     List<Conversation> paginatedConversations = (pageSize.equals(ALL_RECORDS_PER_PAGE))
    //             ? conversationService.findQuestionsFromUser(currentLoggedUser)
    //             : conversationService.findPaginatedQuestionsFromUser(currentLoggedUser, pageNo, pageSize);

    //     model.addAttribute("conversations", paginatedConversations);


    //     long totalConversationAmount = conversationService.countQuestionsFromUser(currentLoggedUser);
    //     model.addAttribute("conversationAmount", totalConversationAmount);

    //     long pageAmount = !pageSize.equals(ALL_RECORDS_PER_PAGE) ? (long) Math.ceil((double) totalConversationAmount / pageSize) : 1;
    //     model.addAttribute("pageAmounts", pageAmount);

    //     return QUESTIONS_PAGE;
    // }

    @GetMapping("/questions")
    @ResponseBody
    public List<Conversation> findAll() throws UserServiceException {
        // User currentLoggedUser = userService.findByEmail(loggedUser.getName());
        // return conversationService.findQuestionsFromUser(currentLoggedUser);
        return conversationService.findAll();
    }

    @PostMapping("/question/save")
    @ResponseBody


    @GetMapping("/questions/users")
    @ResponseBody
    public List<User> getAllUsers(Principal loggedUser) throws UserServiceException {
        User currentLoggedUser = userService.findByEmail(loggedUser.getName());
        return userService.findByUserIsNot(currentLoggedUser);
    }
//
//    @GetMapping(value = {"/questions/edit", "/questions/delete"})
//    @ResponseBody
//    public Conversation findQuestion(Long id) throws ConversationServiceException {
//        return conversationService.findById(id);
//    }
//
//
//
//    @MessageMapping("/conversations/delete-question")
//    public void deleteQuestion(Conversation conversation) throws ConversationServiceException {
//        Conversation realConversation = conversationService.findById(conversation.getId());
//
//        conversationService.delete(realConversation);
//
//        Conversation deletedConversation = new Conversation.Builder()
//                .id(realConversation.getId())
//                .sender(realConversation.getSender())
//                .receiver(realConversation.getReceiver())
//                .build();
//
//        Long receiverId = deletedConversation.getReceiver().getId();
//        Long senderId = deletedConversation.getSender().getId();
//        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, deletedConversation);
//        messagingTemplate.convertAndSend("/topic/messages/" + senderId, deletedConversation);
//    }
//
//    @MessageMapping(value = {"/conversations/add-question/{id}", "/conversations/edit-question/{id}"})
//    public void saveQuestion(@DestinationVariable Long id, @Payload Conversation conversation, Principal loggedUser) throws UserServiceException {
//        User sender = userService.findByEmail(loggedUser.getName());
//        conversation.setSender(sender);
//
//        User receiver = userService.findById(id);
//        conversation.setReceiver(receiver);
//
//        Conversation savedConversation = conversationService.save(conversation);
//
//        messagingTemplate.convertAndSend("/topic/messages/" + receiver.getId(), savedConversation);
//        messagingTemplate.convertAndSend("/topic/messages/" + sender.getId(), savedConversation);
//    }

}
