$(document).ready(function() {

    $(".editAnswerModal").click(function(event) {
        event.preventDefault();
        var href = $(this).attr("href");

        $.get(href, function(conversation, status) {
            $("#id").val(conversation.id);
            $("#answerId").val(conversation.answer.id);
            $("#user").val(conversation.sender.email);
            $("#questionText").val(conversation.questionText);

            let answers = conversation.answer.text;
            answers = answers.replace(/[\r\n]/gm, '');
            const answerOptions = answers.split("|");

            var answerType = conversation.answer.type;
            answerType = answerType.replaceAll('_', ' ');
            answerType = answerType.toLowerCase();
            switch(answerType) {
                case "single line text":
                    $("#answer").append("<input name='answerText' type='text' class='form-control answerText'>");
                    break;
                case "multiline text":
                    $("#answer").append("<textarea name='answerText' class='form-control answerText'></textarea>");
                    break;
                case "date":
                    $("#answer").append("<input name='answerText' type='date' class='form-control answerText'>");
                    break;
                case "radio button":
                    answerOptions.forEach(appendRadioButtonInput);
                    break;
                case "checkbox":
                    answerOptions.forEach(appendCheckboxInput);
                    break;
                case "combobox":
                    $("#answer").append("<input class='form-control answerText' name='answerText' type='text' list='answerOptions'> <datalist class='answerText' id='answerOptions'></datalist>");
                    answerOptions.forEach(appendComboboxInput);
                    break;
            }

        });

        $("#editAnswerModal").modal()
    });

    $("#closeBtn").click(function() {
        $(".answerText").remove();
    });
});

function appendRadioButtonInput(value) {
    $("#answer").append("<div class='form-check answerText'><input name='answerText' value='" + value +
    "' type='radio' class='form-check-input answerText'><label class='form-check-label answerText'>" + value +
    "</label></div>");
}

function appendCheckboxInput(value) {
    $("#answer").append("<div class='form-check answerText'><input name='answerText' value='" + value +
    "' type='checkbox' class='form-check-input answerText'><label class='form-check-label answerText'>" + value +
    "</label></div>");
}

function appendComboboxInput(value) {
    $("#answerOptions").append("<option class='answerText' value='" + value + "'>" + value + "</option>");
}