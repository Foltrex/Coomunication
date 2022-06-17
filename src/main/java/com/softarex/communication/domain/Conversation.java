package com.softarex.communication.domain;

import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Size;

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
    @Column(name = "sender_id", nullable = false)
    private User sender;

    @OneToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Size(min = 1, max = 320)
    @Column(name = "question_text", nullable = false, length = 320)
    private String questionText;

    private AnswerType answerType;

    @Size(max = 320)
    @Column(name = "answer_text", length = 320)
    private String answerText;

    public enum AnswerType {
        CHECKBOX("checkbox"),
        SINGLE_LINE_TEXT("single line text"),
        MULTILINE_TEXT("multiline text"),
        RADIO_BUTTON("radio button"),
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
