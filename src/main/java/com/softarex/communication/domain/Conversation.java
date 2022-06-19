package com.softarex.communication.domain;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Size;

import java.util.HashMap;
import java.util.Map;

import static javax.persistence.GenerationType.AUTO;
import static javax.persistence.GenerationType.IDENTITY;

// TODO: make final

@Entity
@Table(name = "conversations")
@Data
@NoArgsConstructor
public class Conversation implements Identifable {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @OneToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Size(min = 1, max = 320)
    @Column(name = "question_text", nullable = false, length = 320)
    private String questionText;

    @Column(name = "answer_type")
    private AnswerType answerType;

    @Size(max = 320)
    @Column(name = "answer_text", length = 320)
    private String answerText;


    public static class Builder {
        private Long id;
        private User sender;
        private User receiver;
        private String questionText;
        private AnswerType answerType;
        private String answerText;

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

        public Builder answerType(AnswerType val) {
            answerType = val;
            return this;
        }

        public Builder answerText(String val) {
            answerText = val;
            return this;
        }

        public Conversation build() {
            return new Conversation(this);
        }
    }


    public enum AnswerType {
        CHECKBOX("checkbox"),
        SINGLE_LINE_TEXT("single line text"),
        MULTILINE_TEXT("multiline text"),
        RADIO_BUTTON("radio button"),
        COMBOBOX("combobox"),
        DATE("date");

        private final String type;

        private static final Map<String, AnswerType> ELEMENTS = new HashMap<>();
        static {
            for (AnswerType answerType: AnswerType.values()) {
                ELEMENTS.put(answerType.type, answerType);
            }
        }

        AnswerType(String type) {
            this.type = type;
        }

        public static AnswerType valueOfTypeName(String typeName) {
            return ELEMENTS.get(typeName);
        }

        public String getType() {
            return type;
        }
    }


    private Conversation(Builder builder) {
        id = builder.id;
        sender = builder.sender;
        receiver = builder.receiver;
        questionText = builder.questionText;
        answerType = builder.answerType;
        answerText = builder.answerText;
    }
}
