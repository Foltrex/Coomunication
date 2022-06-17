package com.softarex.communication.exception;

public class UserEmptyException extends Exception {
    public UserEmptyException() {
    }

    public UserEmptyException(String message) {
        super(message);
    }

    public UserEmptyException(String message, Throwable cause) {
        super(message, cause);
    }

    public UserEmptyException(Throwable cause) {
        super(cause);
    }

    public UserEmptyException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
