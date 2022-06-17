package com.softarex.communication.controllers;

import com.softarex.communication.domain.Conversation;
import com.softarex.communication.domain.User;
import com.softarex.communication.exception.AuthitificatedUserException;
import com.softarex.communication.service.ConversationService;
import com.softarex.communication.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Controller
public class ConversationsController {
    private static final String CONVERSATIONS_PAGE = "conversations";

    private static final int DEFAULT_CONVERSATIONS_PAGE_SIZE = 10;

    private final ConversationService conversationService;
    private final UserService userService;

    public ConversationsController(ConversationService conversationService, UserService userService) {
        this.conversationService = conversationService;
        this.userService = userService;
    }

    @GetMapping("/")
    public String showHomePage(Model model) {
        int pageNo = 1;
        int pageSize = DEFAULT_CONVERSATIONS_PAGE_SIZE;

        List<Conversation> paginatedConversations = conversationService.findPaginated(pageNo, pageSize);
        model.addAttribute("conversations", paginatedConversations);
        model.addAttribute("conversation", new Conversation());

        List<User> usersForModalForm = userService.findAll();
        model.addAttribute("users", usersForModalForm);

        return CONVERSATIONS_PAGE;
    }

    @GetMapping(value = {"/conversations", "conversations/{pageNo}/{pageSize}"})
    public String showPaginatedConversations(Model model, @PathVariable Optional<Integer> pageNoOptional,
                                                         @PathVariable Optional<Integer> pageSizeOptional) {

        int firstPageNumber = 1;
        int pageNo = pageNoOptional.orElse(firstPageNumber);
        int pageSize = pageSizeOptional.orElse(DEFAULT_CONVERSATIONS_PAGE_SIZE);

        log.info("PageNo: " + pageNo);
        log.info("PageSize: " + pageSize);

        List<Conversation> paginatedConversations = conversationService.findPaginated(pageNo, pageSize);
        model.addAttribute("conversations", paginatedConversations);
        model.addAttribute("conversation", new Conversation());

        List<User> usersForModalForm = userService.findAll();
        model.addAttribute("users", usersForModalForm);

        return CONVERSATIONS_PAGE;
    }

    @PostMapping("/conversations")
    public String addQuestion(@Valid @ModelAttribute("conversation") Conversation conversationWithoutSettedSender,
                              BindingResult bindingResult, Model model, Principal principal) {

        try {
            if (!bindingResult.hasErrors()) {
                setLoggedUserInSender(conversationWithoutSettedSender, principal);

                conversationService.save(conversationWithoutSettedSender);

            } else {
                model.addAttribute("conversation", conversationWithoutSettedSender);
            }
        } catch (AuthitificatedUserException e) {
            log.warn(e.getMessage());
        }

        int pageNo = 1;
        int pageSize = DEFAULT_CONVERSATIONS_PAGE_SIZE;
        List<Conversation> paginatedConversations = conversationService.findPaginated(pageNo, pageSize);
        model.addAttribute("conversations", paginatedConversations);

        List<User> usersForModalForm = userService.findAll();
        model.addAttribute("users", usersForModalForm);


        log.info("Conversation with sender: " + conversationWithoutSettedSender.toString());
        return CONVERSATIONS_PAGE;
    }

    private void setLoggedUserInSender(Conversation conversationWithoutSettedSender, Principal principal) throws AuthitificatedUserException {
        log.info("Logged user's username: " + principal.getName());

        User sender = userService.findByEmail(principal.getName()).orElseThrow(AuthitificatedUserException::new);
        conversationWithoutSettedSender.setSender(sender);
    }
}
