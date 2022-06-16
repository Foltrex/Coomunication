package com.softarex.communication.domain;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "users")
@Getter
public class User implements Identifable {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private final Long id;

    @Size(min = 1, max = 50)
    private final String name;

    @Size(min = 1, max = 50)
    private final String surname;

    @Email
    private final String email;

    @Pattern(regexp = "^\\+375 \\((17|29|33|44)\\) [0-9]{3}-[0-9]{2}-[0-9]{2}$")
    @Column(name = "phone_number", nullable = false, length = 20)
    private final String phoneNumber;

    @Size(min = 1, max = 60)
    private final String password;

    public static class Builder {
        private Long id;
        private String name;
        private String surname;
        private String email;
        private String phoneNumber;
        private String password;

        public Builder id(Long val) {
            id = val;
            return this;
        }

        public Builder name(String val) {
            name = val;
            return this;
        }

        public Builder surname(String val) {
            surname = val;
            return this;
        }

        public Builder email(String val) {
            email = val;
            return this;
        }

        public Builder phoneNumber(String val) {
            phoneNumber = val;
            return this;
        }

        public Builder password(String val) {
            password = val;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }

    private User(Builder builder) {
        id = builder.id;
        name = builder.name;
        surname = builder.surname;
        email = builder.email;
        phoneNumber = builder.phoneNumber;
        password = builder.password;
    }

    public User() {
        id = 0L;
        name = "";
        surname = "";
        email = "";
        phoneNumber = "";
        password = "";
    }
}
