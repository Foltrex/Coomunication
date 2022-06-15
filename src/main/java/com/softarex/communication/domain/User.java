package com.softarex.communication.domain;

import com.sun.istack.NotNull;
import lombok.*;

import javax.persistence.*;

import static javax.persistence.GenerationType.AUTO;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "users")
@Builder
@Value
public class User implements Identifable {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    Long id;

    @Column(nullable = false, length = 50)
    String name;

    @Column(nullable = false, length = 50)
    String surname;

    @Column(nullable = false, unique = true, length = 320)
    String email;

    @Column(name = "phone_number", nullable = false, length = 17)
    String phoneNumber;

    @Column(nullable = false, length = 32)
    String password;

}
