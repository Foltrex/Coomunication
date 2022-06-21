package com.softarex.communication.controllers;

import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.AuthitificatedUserException;
import com.softarex.communication.service.ConversationService;
import com.softarex.communication.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;
import java.util.List;

@Controller
public class AnswersController {
    private static final String ANSWERS_PAGE = "answers";

    private static final Integer ALL_RECORDS_PER_PAGE = -1;

    private final ConversationService conversationService;
    private final UserService userService;

    public AnswersController(ConversationService conversationService, UserService userService) {
        this.conversationService = conversationService;
        this.userService = userService;
    }

    @GetMapping("/answers")
    public String showPaginatedAnswers(Model model, @RequestParam(defaultValue = "0") Integer pageNo,
                                       @RequestParam(defaultValue = "-1") Integer pageSize, Principal principal) throws AuthitificatedUserException {

        User loggedUser = userService.findByEmail(principal.getName()).orElseThrow(AuthitificatedUserException::new);

        List<Conversation> paginatedConversations = (pageSize.equals(ALL_RECORDS_PER_PAGE))
                ? conversationService.findAnswersFromUser(loggedUser)
                : conversationService.findPaginatedAnswersFromUser(loggedUser, pageNo, pageSize);

        model.addAttribute("conversations", paginatedConversations);

        long totalConversationAmount = conversationService.countForUser(loggedUser);
        setAttributesForPagination(model, pageNo, pageSize, totalConversationAmount);

        return ANSWERS_PAGE;
    }

    @GetMapping("/answers/edit")
    @ResponseBody
    public Conversation editAnswer(Long id) {
        return conversationService.findById(id).orElseThrow(IllegalArgumentException::new);
    }

    @PostMapping("/answers/save")
    public String saveAnswer() {
        return "";
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
