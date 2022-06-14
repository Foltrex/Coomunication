package com.softarex.communication.model;

import lombok.Data;

@Data
public class User implements Identifable {
    private final Long id;
    private final String name;
    private final String surname;
    private final String email;
    private final String phoneNumber;
    private final String password;
    
}
