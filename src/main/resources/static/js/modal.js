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

    $(".editModal").click(function(event) {
        event.preventDefault();
        var href = $(this).attr("href");

        $.get(href, function(conversation, status) {
            $("#id").val(conversation.id);
            $("#senderId").val(conversation.sender.id);
            $("#ddEditUser option[value=conversation.receiver.email]").attr("selected", "selected");
            $("#questionText").val(conversation.questionText);
//            $("#ddEditAnswerType").val(conversation.answerType.type).change();
            let text = conversation.answerText;
            const answerText = text.replace('|', '\n');
            $("#editAnswer").val(answerText);
        });

        $("#editQuestionModal").modal()
    });
});
