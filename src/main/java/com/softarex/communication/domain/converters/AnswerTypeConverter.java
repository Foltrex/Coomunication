package com.softarex.communication.domain.converters;

import com.softarex.communication.domain.Answer;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.stream.Stream;

@Converter(autoApply = true)
public class AnswerTypeConverter implements AttributeConverter<Answer.Type, String> {
    @Override
    public String convertToDatabaseColumn(Answer.Type answerType) {
        if (answerType == null) {
            return null;
        }

        return answerType.getType();
    }

    @Override
    public Answer.Type convertToEntityAttribute(String type) {
        if (type == null) {
            return null;
        }

        return Stream.of(Answer.Type.values())
                .filter(c -> c.getType().equals(type))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}