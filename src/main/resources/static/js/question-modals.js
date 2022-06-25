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

    $("#questionTable").on("click", ".deleteQuestionModal", function(event) {
        event.preventDefault();
        var href = $(this).attr("href");
         $.get(href, function(conversation, status) {
            $("#conversationId").val(conversation.id);
         });

         $("#deleteQuestionModal").modal()
    });

    $(".addQuestionModal").click(function() {
        var select = document.getElementById("ddUser");
        addUsersToSelect(select);
    });

    $("#questionTable").on("click", ".editQuestionModal", function(event) {
        event.preventDefault();

        var select = document.getElementById("ddEditUser");
        addUsersToSelect(select);

        var href = $(this).attr("href");

        $.get(href, function(conversation, status) {
            $("#id").val(conversation.id);
            $("#answerId").val(conversation.answer.id);
            $("#ddEditUser > option").each(function() {
                var currentOption = $(this);
                if (currentOption.text() === conversation.receiver.email) {
                    currentOption.attr("selected", "selected");
                }
            });

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

function addUsersToSelect(select) {
    if (select.children.length !== 0) {
        return;
    }

    const xhttp = new XMLHttpRequest();

    xhttp.onload = function() {
        var users = JSON.parse(this.responseText);
        for (let x in users) {
            var option = document.createElement('option');
            option.value = users[x].id;
            option.innerHTML = users[x].email;
            select.appendChild(option);
        }
    }

    xhttp.open("GET", "/questions/users");
    xhttp.send();
}
