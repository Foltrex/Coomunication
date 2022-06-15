package com.softarex.communication.model;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Builder
@EqualsAndHashCode
@ToString
public class Conversation implements Identifable {
    @Getter
    private final Long id;

    @Getter
    private final User sender;

    @Getter
    private final User receiver;

    @Getter
    private final String questionText;

    @Getter
    private final AnswerType answerType;

    @Getter
    private final String answerText;

    public enum AnswerType {
        SINGLE_LINE_TEXT,
        MULTILINE_TEXT,
        RADIO_BUTTON,
        CHECKBOX,
        COMBOBOX,
        DATE
    }
}
