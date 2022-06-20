package com.softarex.communication.controllers;

import com.softarex.communication.domain.Answer;
import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.AuthitificatedUserException;
import com.softarex.communication.service.AnswerService;
import com.softarex.communication.service.ConversationService;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
public class ConversationsController {
    private static final String REDIRECT = "redirect:/";
    private static final String CONVERSATIONS_PAGE = "conversations";

    private static final String ANSWER_TEXT_SEPARATOR = "|";
    private static final Integer ALL_RECORDS_PER_PAGE = -1;

    private final ConversationService conversationService;
    private final UserService userService;
    private final AnswerService answerService;

    public ConversationsController(ConversationService conversationService, UserService userService, AnswerService answerService) {
        this.conversationService = conversationService;
        this.userService = userService;
        this.answerService = answerService;
    }

    @GetMapping(value = {"/conversations", "/"})
    public String showPaginatedConversations(Model model, @RequestParam(defaultValue = "0") Integer pageNo,
                                             @RequestParam(defaultValue = "-1") Integer pageSize, Principal principal) throws AuthitificatedUserException {

        User loggedUser = getLoggedUser(principal);

        List<Conversation> paginatedConversations = (pageSize == ALL_RECORDS_PER_PAGE)
                ? conversationService.findQuestionsFromUser(loggedUser)
                : conversationService.findPaginatedQuestionsFromUser(loggedUser, pageNo, pageSize);

        model.addAttribute("conversations", paginatedConversations);

        List<User> usersForModalForm = userService.findAll();
        model.addAttribute("users", usersForModalForm);

        long totalConversationAmount = conversationService.countForUser(loggedUser);
        setAttributesForPagination(model, pageNo, pageSize, totalConversationAmount);

        return CONVERSATIONS_PAGE;
    }

    @GetMapping(value = "/conversations/edit")
    @ResponseBody
    public Conversation findQuestion(Integer id) {
        return conversationService.findById(Long.valueOf(id)).orElseThrow(IllegalArgumentException::new);
    }

    @PostMapping
    public String saveQuestion(@RequestParam Map<String, String> allParams, Model model) {
        return "";
    }

    @PostMapping("/conversations/new")
    public String addQuestion(@RequestParam Map<String, String> allParams, Model model, Principal principal) throws AuthitificatedUserException {

        Conversation conversation = null;
        try {
            conversation = extractConversationFromRequest(allParams, principal);
            log.info("Conversation getted from request: " + conversation);

            conversationService.save(conversation);
        } catch (AuthitificatedUserException e) {
            log.warn(e.getMessage());
        }

        User loggedUser = getLoggedUser(principal);
        List<Conversation> paginatedConversations = conversationService.findQuestionsFromUser(loggedUser);
        model.addAttribute("conversations", paginatedConversations);

        List<User> usersForModalForm = userService.findAll();
        model.addAttribute("users", usersForModalForm);


        log.info("Conversation with sender: " + conversation);
        return REDIRECT + CONVERSATIONS_PAGE;
    }



    private Conversation extractConversationFromRequest(@RequestParam Map<String,String> allParams, Principal principal) throws AuthitificatedUserException {
        User sender = getLoggedUser(principal);

        Long receiverId = Long.valueOf(allParams.get("receiverId"));
        User receiver = userService.findById(receiverId).orElseThrow(IllegalArgumentException::new);

        String question = allParams.get("questionText");

        String answerTypeName = allParams.get("answerTypeName");
        Answer.Type answerType = Answer.Type.valueOfTypeName(answerTypeName);

        String answerText = allParams.get("answerText");
        answerText = answerText.replaceAll("\n", "|");
        Answer answer = new Answer(null, answerType, answerText);
        answerService.save(answer);

        Conversation conversation = new Conversation.Builder()
                .sender(sender)
                .receiver(receiver)
                .questionText(question)
                .answer(answer)
                .build();

        return conversation;
    }

    private User getLoggedUser(Principal principal) throws AuthitificatedUserException {
        log.info("Logged user's username: " + principal.getName());
        User sender = userService.findByEmail(principal.getName()).orElseThrow(AuthitificatedUserException::new);
        return sender;
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
