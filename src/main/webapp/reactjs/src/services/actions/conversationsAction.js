import axios from 'axios';
import * as CT from '../types/conversationTypes';

export const saveConversation = conversation => {
    return dispatch => {
        dispatch({
            type: CT.SAVE_CONVERSATION_REQUEST
        });
        axios
            .post('http://localhost:8080/conversation/save', conversation)
            .then(response => {
                console.log(response.data)
                dispatch(conversationSuccess(response.data));
            })
            .catch(error => {
                dispatch(conversationFailure(error));
            });
    };
};

export const fetchConversation = id => {
    return dispatch => {
        dispatch({
            type: CT.FETCH_CONVERSATION_REQUEST,
        });
        axios
            .get('http://localhost:8080/conversations/' + id)
            .then(response => {
                dispatch(conversationSuccess(response.data));
            })
            .catch(error => {
                dispatch(conversationFailure(error));
            });
    };
};

export const fetchQuestions = (pageNo, pageSize) => {
    pageNo ??= 0;
    
    const allRecordsPerPage = -1;
    pageSize ??= allRecordsPerPage;

    return dispatch => {
        dispatch({
            type: CT.FETCH_CONVERSATIONS_REQUEST,
        });
        axios
            .get('http://localhost:8080/questions?pageNo=' + pageNo + "&pageSize=" + pageSize)
            .then(response => {
                dispatch({
                    type: CT.CONVERSATIONS_SUCCESS,
                    payload: response.data
                });
            })
            .then(data => {
                data.forEach(conversation => {
                    let answerType = conversation.answer.type;
                    answerType = answerType.toLowerCase();
                    answerType = answerType.replace(/_/g, ' ');
                    conversation.answer.type = answerType;
    
                    let answerText = conversation.answer.text;
                    conversation.answer.text = (!answerText.includes('|')) ? answerText : '';
                });
            })
            .catch(error => {
                dispatch({
                    type: CT.CONVERSATIONS_FAILURE,
                    payload: error
                });
            });
    };
}


const conversationSuccess = conversation => {
    return {
        type: CT.CONVERSATION_SUCCESS,
        payload: conversation
    };
};

const conversationFailure = error => {
    return {
        type: CT.CONVERSATION_FAILURE,
        payload: error
    };
};