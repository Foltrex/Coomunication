$(document).ready(function() {

    $(".editAnswerModal").click(function(event) {
        event.preventDefault();
        var href = $(this).attr("href");

        $.get(href, function(conversation, status) {
            $("#id").val(conversation.id);
            $("#answerId").val(conversation.answer.id);
            $("#user").val(conversation.sender.email);
            $("#questionText").val(conversation.questionText);

        });

        $("#editAnswerModal").modal()
    });
});