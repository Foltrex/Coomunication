package com.softarex.communication.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Answer implements Identifable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Type type;

    @Size(max = 320)
    private String text;

    public enum Type {
        CHECKBOX("checkbox"),
        SINGLE_LINE_TEXT("single line text"),
        MULTILINE_TEXT("multiline text"),
        RADIO_BUTTON("radio button"),
        COMBOBOX("combobox"),
        DATE("date");

        private final String type;

        private static final Map<String, Type> ELEMENTS = new HashMap<>();
        static {
            for (Type answerType: Type.values()) {
                ELEMENTS.put(answerType.type, answerType);
            }
        }

        Type(String type) {
            this.type = type;
        }

        public static Type valueOfTypeName(String typeName) {
            return ELEMENTS.get(typeName);
        }

        public String getType() {
            return type;
        }
    }
}
