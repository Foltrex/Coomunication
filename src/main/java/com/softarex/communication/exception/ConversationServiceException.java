package com.softarex.communication.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class ConversationServiceException extends Exception {
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
