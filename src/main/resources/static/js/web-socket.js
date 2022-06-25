var stompClient = null;
var loggedUserId = null;

function connect(id) {
    var socket = new SockJS('/chat');
    stompClient = Stomp.over(socket);
    loggedUserId = $("#loggedUser").val();

    stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages/' + loggedUserId, function(messageOutput) {
            console.log("i got sth");
            showMessageOutput(JSON.parse(messageOutput.body));
        });
    });
}

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

    stompClient.send("/app/chat/" + receiverId, {}, JSON.stringify(message));
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

    stompClient.send("/app/chat/answer", {}, JSON.stringify(message));
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

    stompClient.send("/app/chat/" + receiverId, {}, JSON.stringify(message));
}

function deleteQuestion() {
    var conversationId = $('#conversationId').val();
    var message = {
        "id":conversationId
    }

    stompClient.send("/app/chat/delete", {}, JSON.stringify(message));
}

function showMessageOutput(messageOutput) {
    console.log(messageOutput);
    if (messageOutput.questionText === null) {
        deleteConversation(messageOutput.id);
        return;
    }

    var receiverId = parseInt(messageOutput.receiver.id, 10);
    var senderId = parseInt(messageOutput.sender.id, 10);
    if (receiverId === parseInt(loggedUserId, 10)) {
        saveMessageInAnswerTable(messageOutput);
    } else if (senderId === parseInt(loggedUserId, 10)) {
        saveMessageInQuestionTable(messageOutput);
    }

    // var pageSize = $("#pageSize").val()
}

function saveMessageInAnswerTable(messageOutput) {
    console.log("i work in answer table");
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
        console.log("i work in question table");
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
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function deleteConversation(id) {
    var conversation = document.querySelector("#conversation-" + id);
    removeAllChildNodes(conversation);
    conversation.remove();
}

