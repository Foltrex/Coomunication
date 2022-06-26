var stompClient = null;
var loggedUserId = null;

function connect() {
    var socket = new SockJS('/conversations');
    stompClient = Stomp.over(socket);
    loggedUserId = $("#loggedUser").val();

    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages/' + loggedUserId, function(messageOutput) {
            showMessageOutput(JSON.parse(messageOutput.body));
        });
    });
}

// TODO: DELETE
function disconnect() {
    if(stompClient != null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

function addQuestion() {
    var receiverString = $('#ddUser').val();
    var receiverId = parseInt(receiverString);
    $('#ddUser').val("");
    
    var questionText = $('#questionTextNew').val();
     $('#questionTextNew').val("");

    var answerTypeValue = $('#ddAnswerType').val();
    var answerTypeName = new String(answerTypeValue);
    answerTypeName = answerTypeName.replaceAll(' ', '_');
    answerTypeName = answerTypeName.toUpperCase();
    
    var answerTextValue = $('#answer').val();
    var answerText = new String(answerTextValue);
    answerText = answerText.replace(/[\r\n]/gm, '|');
    $('#answer').val("");

     var message = {
        "questionText":questionText,
        "answer": {
            "type":answerTypeName,
            "text":answerText
        }
    }

    stompClient.send("/app/conversations/add-question/" + receiverId, {}, JSON.stringify(message));
}

function editAnswer() {
    var conversationId = $("#id").val();

    var answerId = $("#answerId").val();
    var answerText = $(".answerText").val();

    var message = {
        "id":conversationId,
        "answer": {
            "id":answerId,
            "text":answerText
        }
    }

    stompClient.send("/app/conversations/add-answer", {}, JSON.stringify(message));
}

function editQuestion() {
    var conversationId = $("#id").val();
    var receiverString = $('#ddEditUser').val();
    var receiverId = parseInt(receiverString);
    $('#ddEditUser').val("");

    var questionText = $('#questionText').val();
     $('#questionText').val("");

     var answerId = $('#answerId').val();

    var answerTypeValue = $('#ddEditAnswerType').val();
    var answerTypeName = new String(answerTypeValue);
    answerTypeName = answerTypeName.replaceAll(' ', '_');
    answerTypeName = answerTypeName.toUpperCase();

    var answerTextValue = $('#editAnswer').val();
    var answerText = new String(answerTextValue);
    answerText = answerText.replace(/[\r\n]/gm, '|');
    $('#editAnswer').val("");

     var message = {
        "id":conversationId,
        "questionText":questionText,
        "answer": {
            "id":answerId,
            "type":answerTypeName,
            "text":answerText
        }
    }

    stompClient.send("/app/conversations/edit-question/" + receiverId, {}, JSON.stringify(message));
}

function deleteQuestion() {
    var conversationId = $('#conversationId').val();
    var message = {
        "id":conversationId
    }

    stompClient.send("/app/conversations/delete-question", {}, JSON.stringify(message));
}

function showMessageOutput(messageOutput) {
    var receiverId = parseInt(messageOutput.receiver.id, 10);
    var senderId = parseInt(messageOutput.sender.id, 10);
    
    if (messageOutput.questionText === null) {
        var currentRecordsOnPage = $("#questionTable tr").length;

        console.log(typeof currentRecordsOnPage);
        console.log(currentRecordsOnPage);

        if (currentRecordsOnPage === 1) {
            // TODO: CHECK THIS PART OF CODE
            if (receiverId === parseInt(loggedUserId, 10)) {
                location.href = "/answers";
            } else {
                location.href = "/questions";
            }
        } else {
            deleteConversation(messageOutput.id);
        }
        return;
    }

    if (receiverId === parseInt(loggedUserId, 10)) {
        saveMessageInAnswerTable(messageOutput);
    } else if (senderId === parseInt(loggedUserId, 10)) {
        saveMessageInQuestionTable(messageOutput);
    }
}

function saveMessageInAnswerTable(messageOutput) {
    var senderEmailColumn = `<td>${messageOutput.sender.email}</td>`;
    var questionTextColumn = `<td>${messageOutput.questionText}</td>`;


    var answerText = messageOutput.answer.text;
     if (answerText.includes("|")) {
        answerText = "";
     }
     var answerTextColumn = `<td>${answerText}</td>`

     var iconsColumn = "<td class='icons-column'><a href='/answers/edit/?id=" + messageOutput.id + "' class='editAnswerModal'>" +
     "<i class='fa-solid fa-pen-to-square' data-toggle='tooltip' title='Edit'></i></a></td>";


    var answerSelector = document.querySelector("#conversation-" + messageOutput.id);
    if (answerSelector !== null) {
        removeAllChildNodes(answerSelector);
        $("#conversation-" + messageOutput.id).append(senderEmailColumn + questionTextColumn + answerTextColumn + iconsColumn);
    } else {
        $("#answerTable").append("<tr id='conversation-" + messageOutput.id + "'>" + senderEmailColumn + questionTextColumn + answerTextColumn + iconsColumn + "</tr>");
    }
}

function saveMessageInQuestionTable(messageOutput) {
    var currentRecordsOnPage = $("#questionTable tr").length;
    var maxRecordsOnPageString = $("#pageSize").val();
    var maxRecordsOnPage = parseInt(maxRecordsOnPageString, 10);

    console.log(typeof currentRecordsOnPage);
    console.log(currentRecordsOnPage);

    if (currentRecordsOnPage === maxRecordsOnPage) {
        location.href = "/questions";
        return;
    }

    var receiverEmailColumn = `<td>${messageOutput.receiver.email}</td>`;
    var questionTextColumn = `<td>${messageOutput.questionText}</td>`;

    var answerType = messageOutput.answer.type;
    answerType = answerType.replaceAll('_', ' ');
    answerType = answerType.toLowerCase();

    var answerTypeColumn = `<td>${answerType}</td>`;

    var answerText = messageOutput.answer.text;
        if (answerText.includes("|")) {
        answerText = "";
        }
        var answerTextColumn = `<td>${answerText}</td>`

        var iconsColumn = "<td class='icons-column'><a href='/questions/edit/?id=" + messageOutput.id + "' class='editQuestionModal'>" +
        "<i class='fa-solid fa-pen-to-square' data-toggle='tooltip' title='Edit'></i></a>" +
        "<a href='/questions/delete/?id=" + messageOutput.id + "' class='deleteQuestionModal'>"+
        "<i class='fa-solid fa-trash-can' data-toggle='tooltip' title='Delete'></i></a></td>";


    var questionSelector = document.querySelector("#conversation-" + messageOutput.id);
    if (questionSelector !== null) {
        removeAllChildNodes(questionSelector);
        $("#conversation-" + messageOutput.id).append(receiverEmailColumn + questionTextColumn + answerTypeColumn + answerTextColumn + iconsColumn);
    } else {
        $("#questionTable").append("<tr id='conversation-" + messageOutput.id + "'>" + receiverEmailColumn + questionTextColumn + answerTypeColumn + answerTextColumn + iconsColumn + "</tr>");
    }


    var recordsCountString = $("#recordsCounts").text();
    var recordsCounts = parseInt(recordsCountString, 10);
    ++recordsCounts;
    $("#recordsCounts").text(recordsCounts);

    var totalRecordsCountString = $("#totalRecordsCount").text();
    var totalRecordsCount = parseInt(totalRecordsCountString, 10);
    ++totalRecordsCount;
    $("#totalRecordsCount").text(totalRecordsCount);
}

function deleteConversation(id) {
    var conversation = document.querySelector("#conversation-" + id);
    removeAllChildNodes(conversation);
    conversation.remove();

    var recordsCountString = $("#recordsCounts").text();
    var recordsCounts = parseInt(recordsCountString, 10);
    --recordsCounts;
    $("#recordsCounts").text(recordsCounts);

    var totalRecordsCountString = $("#totalRecordsCount").text();
    var totalRecordsCount = parseInt(totalRecordsCountString, 10);
    --totalRecordsCount;
    $("#totalRecordsCount").text(totalRecordsCount);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


