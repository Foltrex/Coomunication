package com.softarex.communication.exception;

import org.springframework.web.bind.annotation.ResponseStatus;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@ResponseStatus(value = NOT_FOUND, reason = "No such Conversation")
public class ConversationServiceException extends RuntimeException {
    public ConversationServiceException() {
        super();
    }

    public ConversationServiceException(String message) {
        super(message);
    }

    public ConversationServiceException(String message, Throwable cause) {
        super(message, cause);
    }

    public ConversationServiceException(Throwable cause) {
        super(cause);
    }

    protected ConversationServiceException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
