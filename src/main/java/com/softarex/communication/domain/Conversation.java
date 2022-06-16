package com.softarex.communication.domain;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Size;

import static javax.persistence.GenerationType.AUTO;
import static javax.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "conversations")
@Builder
@Value
public class Conversation implements Identifable {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    User receiver;

    @Size(min = 1, max = 320)
    @Column(name = "question_text", nullable = false, length = 320)
    String questionText;

    AnswerType answerType;

    @Size(max = 320)
    @Column(name = "answer_text", length = 320)
    String answerText;

    public enum AnswerType {
        SINGLE_LINE_TEXT("single line text"),
        MULTILINE_TEXT("multiline text"),
        RADIO_BUTTON("radio button"),
        CHECKBOX("checkbox"),
        COMBOBOX("combobox"),
        DATE("date");

        private final String type;

        AnswerType(String type) {
            this.type = type;
        }

        public String getType() {
            return type;
        }
    }
}
