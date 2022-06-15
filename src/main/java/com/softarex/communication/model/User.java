package com.softarex.communication.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Builder
@EqualsAndHashCode
@ToString
public class User implements Identifable {
    @Getter
    private final Long id;

    @Getter
    private final String name;

    @Getter
    private final String surname;

    @Getter
    private final String email;

    @Getter
    private final String phoneNumber;

    @Getter
    private final String password;

}
