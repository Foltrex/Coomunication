package com.softarex.communication.exception;

public class AuthitificatedUserException extends Exception {
    public AuthitificatedUserException() {
    }

    public AuthitificatedUserException(String message) {
        super(message);
    }

    public AuthitificatedUserException(String message, Throwable cause) {
        super(message, cause);
    }

    public AuthitificatedUserException(Throwable cause) {
        super(cause);
    }

    public AuthitificatedUserException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
