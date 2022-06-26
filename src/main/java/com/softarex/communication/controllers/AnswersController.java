package com.softarex.communication.controllers;

import com.softarex.communication.domain.Answer;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.ConversationServiceException;
import com.softarex.communication.exception.UserServiceException;
import com.softarex.communication.service.ConversationService;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;
import java.util.List;

@Slf4j
@Controller
public class AnswersController {
    private static final String ANSWERS_PAGE = "answers";

    private static final Integer ALL_RECORDS_PER_PAGE = -1;

    private final ConversationService conversationService;
    private final UserService userService;

    private final SimpMessagingTemplate messagingTemplate;

    public AnswersController(ConversationService conversationService, UserService userService,
                             SimpMessagingTemplate messagingTemplate) {
        this.conversationService = conversationService;
        this.userService = userService;

        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/answers")
    public String showPaginatedAnswers(Model model, @RequestParam(defaultValue = "0") Integer pageNo,
                                       @RequestParam(defaultValue = "-1") Integer pageSize, Principal loggedUser) throws UserServiceException {

        User currentLoggedUser = userService.findByEmail(loggedUser.getName());

        model.addAttribute("pageNo", pageNo);
        model.addAttribute("pageSize", pageSize);
        model.addAttribute("loggedUser", currentLoggedUser);

        List<Conversation> paginatedConversations = (pageSize.equals(ALL_RECORDS_PER_PAGE))
                ? conversationService.findAnswersFromUser(currentLoggedUser)
                : conversationService.findPaginatedAnswersFromUser(currentLoggedUser, pageNo, pageSize);

        model.addAttribute("conversations", paginatedConversations);

        long totalConversationAmount = conversationService.countAnswersFromUser(currentLoggedUser);
        model.addAttribute("conversationAmount", totalConversationAmount);

        long pageAmount = !pageSize.equals(ALL_RECORDS_PER_PAGE) ? (long) Math.ceil((double) totalConversationAmount / pageSize) : 1;
        model.addAttribute("pageAmounts", pageAmount);

        return ANSWERS_PAGE;
    }

    @MessageMapping("/conversations/add-answer")
    public void editAnswer(Conversation conversation) throws ConversationServiceException {
        Conversation realConversation = conversationService.findById(conversation.getId());
        Answer realAnswer = realConversation.getAnswer();
        Answer answer = conversation.getAnswer();
        realAnswer.setText(answer.getText());

        User realSender = realConversation.getSender();
        Long senderId = realSender.getId();

        User realReceiver = realConversation.getReceiver();
        Long receiverId = realReceiver.getId();

        Conversation savedConversation = conversationService.save(realConversation);

        messagingTemplate.convertAndSend("/topic/messages/" + senderId, savedConversation);
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, savedConversation);
    }

    @GetMapping("/answers/edit")
    @ResponseBody
    public Conversation editAnswer(Long id) throws ConversationServiceException {
        return conversationService.findById(id);
    }
}
