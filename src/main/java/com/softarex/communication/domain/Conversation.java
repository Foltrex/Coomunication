package com.softarex.communication.domain;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Size;

import java.util.HashMap;
import java.util.Map;

import static javax.persistence.CascadeType.*;
import static javax.persistence.GenerationType.AUTO;
import static javax.persistence.GenerationType.IDENTITY;


/** Represents a conversation between two users */
@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
public class Conversation implements Identifable {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Size(min = 1, max = 320)
    @Column(name = "question_text", nullable = false, length = 320)
    private String questionText;

    @OneToOne(cascade = {PERSIST, MERGE, REFRESH, DETACH})
    @JoinColumn(name = "answer_id")
    private Answer answer;


    public static class Builder {
        private Long id;
        private User sender;
        private User receiver;
        private String questionText;
        private Answer answer;

        public Builder id(Long val) {
            id = val;
            return this;
        }

        public Builder sender(User val) {
            sender = val;
            return this;
        }

        public Builder receiver(User val) {
            receiver = val;
            return this;
        }

        public Builder questionText(String val) {
            questionText = val;
            return this;
        }

        public Builder answer(Answer val) {
            answer = val;
            return this;
        }

        public Conversation build() {
            return new Conversation(this);
        }
    }


    private Conversation(Builder builder) {
        id = builder.id;
        sender = builder.sender;
        receiver = builder.receiver;
        questionText = builder.questionText;
        answer = builder.answer;
    }
}
