package com.softarex.communication.domain.converters;

import com.softarex.communication.domain.Conversation;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.stream.Stream;

@Converter(autoApply = true)
public class AnswerTypeConverter implements AttributeConverter<Conversation.AnswerType, String> {
    @Override
    public String convertToDatabaseColumn(Conversation.AnswerType answerType) {
        if (answerType == null) {
            return null;
        }

        return answerType.getType();
    }

    @Override
    public Conversation.AnswerType convertToEntityAttribute(String type) {
        if (type == null) {
            return null;
        }

        return Stream.of(Conversation.AnswerType.values())
                .filter(c -> c.getType().equals(type))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}