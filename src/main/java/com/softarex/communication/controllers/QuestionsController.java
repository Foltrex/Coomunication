package com.softarex.communication.controllers;

import com.softarex.communication.domain.Answer;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.AuthitificatedUserException;
import com.softarex.communication.service.AnswerService;
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
import java.util.Map;

@Slf4j
@Controller
public class QuestionsController {
    private static final String REDIRECT = "redirect:/";
    private static final String QUESTIONS_PAGE = "questions";

    private static final String ANSWER_TEXT_SEPARATOR = "|";
    private static final Integer ALL_RECORDS_PER_PAGE = -1;

    private final ConversationService conversationService;
    private final UserService userService;
    private final AnswerService answerService;

    private final SimpMessagingTemplate messagingTemplate;

    public QuestionsController(ConversationService conversationService, UserService userService, AnswerService answerService,
                               SimpMessagingTemplate messagingTemplate) {
        this.conversationService = conversationService;
        this.userService = userService;
        this.answerService = answerService;

        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping(value = {"/questions", "/"})
    public String showPaginatedQuestions(Model model, @RequestParam(defaultValue = "0") Integer pageNo,
                                             @RequestParam(defaultValue = "-1") Integer pageSize, Principal principal) throws AuthitificatedUserException {

        User loggedUser = userService.findByEmail(principal.getName()).orElseThrow(AuthitificatedUserException::new);

        List<Conversation> paginatedConversations = (pageSize.equals(ALL_RECORDS_PER_PAGE))
                ? conversationService.findQuestionsFromUser(loggedUser)
                : conversationService.findPaginatedQuestionsFromUser(loggedUser, pageNo, pageSize);

        model.addAttribute("conversations", paginatedConversations);

        List<User> usersForModalForm = userService.findAll();
        model.addAttribute("users", usersForModalForm);
        model.addAttribute("loggedUser", loggedUser);

        long totalConversationAmount = conversationService.countQuestionsFromUser(loggedUser);
        setAttributesForPagination(model, pageNo, pageSize, totalConversationAmount);

        return QUESTIONS_PAGE;
    }

    @GetMapping(value = {"/questions/edit", "/questions/delete"})
    @ResponseBody
    public Conversation findQuestion(Long id) {
        return conversationService.findById(id).orElseThrow(IllegalArgumentException::new);
    }

    @PostMapping(value = {"/questions/new", "/questions/save"})
    public String addQuestion(@RequestParam Map<String, String> allParams, Model model, Principal principal) {

        Conversation conversation = null;
        try {
            conversation = extractConversationFromRequest(allParams, principal);
            log.info("Conversation getted from request: " + conversation);

            conversationService.save(conversation);
        } catch (AuthitificatedUserException e) {
            log.warn(e.getMessage());
        }

        return REDIRECT + QUESTIONS_PAGE;
    }

    @MessageMapping("/chat/delete")
    public void deleteQuestion(Conversation conversation) {
        Conversation realConversation = conversationService.findById(conversation.getId()).orElseThrow(IllegalArgumentException::new);
        log.info("Delete conversation: " + realConversation);
        conversationService.delete(realConversation);

        Long receiverId = realConversation.getReceiver().getId();
        Long senderId = realConversation.getSender().getId();

        Conversation deletedConversation = new Conversation.Builder().id(realConversation.getId()).build();
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, deletedConversation);
        messagingTemplate.convertAndSend("/topic/messages/" + senderId, deletedConversation);
    }

    @MessageMapping("/chat/{id}")
    public void sendQuestion(@DestinationVariable Long id, @Payload Conversation conversation, Principal loggedUser) {
        User sender = userService.findByEmail(loggedUser.getName()).orElseThrow(IllegalArgumentException::new);
        User receiver = userService.findById(id).orElseThrow(IllegalArgumentException::new);
        conversation.setSender(sender);
        conversation.setReceiver(receiver);

        log.info("Received conversation" + conversation);
        Conversation savedConversation = conversationService.save(conversation);
        messagingTemplate.convertAndSend("/topic/messages/" + id, savedConversation);
        messagingTemplate.convertAndSend("/topic/messages/" + sender.getId(), savedConversation);
//        // answer from receiver
//        messagingTemplate.convertAndSendToUser(String.valueOf(receiverId),destination, conversation);
//
//        // question from sender
//        messagingTemplate.convertAndSendToUser(String.valueOf(sender.getId()), destination, conversation);
    }

    @PostMapping("/questions/delete")
    public String deleteQuestion(@RequestParam Long conversationId, Model model, Principal principal) {
        Conversation deletedConversation = conversationService.findById(conversationId)
                .orElseThrow(IllegalArgumentException::new);

        Answer deletedAnswer = deletedConversation.getAnswer();

        conversationService.delete(deletedConversation);

        return REDIRECT + QUESTIONS_PAGE;
    }


    private Conversation extractConversationFromRequest(@RequestParam Map<String,String> allParams, Principal principal) throws AuthitificatedUserException {

        String conversationIdString = allParams.get("id");
        Long conversationId = (conversationIdString != null) ? Long.valueOf(conversationIdString) : null;

        User sender = userService.findByEmail(principal.getName()).orElseThrow(AuthitificatedUserException::new);

        String receiverIdString = allParams.get("receiverId");
        Long receiverId = (receiverIdString != null) ? Long.valueOf(receiverIdString) : null;
        User receiver = userService.findById(receiverId).orElseThrow(IllegalArgumentException::new);

        String question = allParams.get("questionText");

        String answerIdString = allParams.get("answerId");
        Long answerid = (answerIdString != null) ? Long.valueOf(answerIdString) : null;

        String answerTypeName = allParams.get("answerTypeName");
        Answer.Type answerType = Answer.Type.valueOfTypeName(answerTypeName);

        String answerText = allParams.get("answerText");
        answerText = answerText.replaceAll("\n", "|");
        Answer answer = new Answer(answerid, answerType, answerText);
        answerService.save(answer);

        Conversation conversation = new Conversation.Builder()
                .id(conversationId)
                .sender(sender)
                .receiver(receiver)
                .questionText(question)
                .answer(answer)
                .build();

        return conversation;
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
