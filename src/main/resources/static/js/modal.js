$(document).ready(function(){

    $("#ddAnswerType").change(function() {
        var value = $(this).val();

        var answer = $("#answer");

        console.log(value);
        switch (value) {
            case "single line text":
            case "multiline text":
            case "date":
                answer.prop("readonly", true);
                break;
            case "radio button":
            case "checkbox":
            case "combobox":
                answer.prop("readonly", false);
                break;
        }
    });

    $("#ddEditAnswerType").change(function() {
            var value = $(this).val();

            var answer = $("#editAnswer");

            console.log(value);
            switch (value) {
                case "single line text":
                case "multiline text":
                case "date":
                    answer.prop("readonly", true);
                    break;
                case "radio button":
                case "checkbox":
                case "combobox":
                    answer.prop("readonly", false);
                    break;
            }
        });

    $(".editModal").click(function(event) {
        event.preventDefault();
        var href = $(this).attr("href");

        $.get(href, function(conversation, status) {
            $("#id").val(conversation.id);
            $("#senderId").val(conversation.sender.id);
            $("#ddEditUser > option").each(function() {
                var currentOption = $(this);
                if (currentOption.text() === conversation.receiver.email) {
                    currentOption.attr("selected", "selected");
                }
            });
//             val(conversation.receiver.email);
            $("#questionText").val(conversation.questionText);

            $("#ddEditAnswerType > option").each(function() {
                var currentOption = $(this);
                var answerType = conversation.answer.type;
                answerType = answerType.replaceAll('_', ' ');
                answerType = answerType.toLowerCase();
                if (currentOption.text() === answerType) {
                    currentOption.attr("selected", "selected");
                    $("#ddEditAnswerType").change();
                }
            });

            let text = conversation.answer.text;
            const answerText = text.replaceAll('|', '\n');
            $("#editAnswer").val(answerText);
        });

        $("#editQuestionModal").modal()
    });
});
