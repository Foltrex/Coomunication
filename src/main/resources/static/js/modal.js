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

        $("#editQuestionModal").modal()
    });
});
