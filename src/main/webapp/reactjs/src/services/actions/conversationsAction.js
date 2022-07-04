import axios from 'axios';
import * as BT from '../types/conversationTypes';

export const saveConversation = conversation => {
    return dispatch => {
        dispatch({
            type: BT.SAVE_CONVERSATION_REQUEST
        });
        axios.post('http://localhost:8080/question/save', conversation)
            .then(response => {
                dispatch(conversationSuccess(response.data));
            })
            .catch(error => {
                dispatch(conversationFailure(error));
            });
    };
};

export const fetchAnswerTypes = () => {
    return dispatch => {
        dispatch({
            type: BT.FETCH_ANSWER_TYPE_REQUEST
        });
        axios.get('http://localhost:8080/answer/types')
            .then(response => {
                dispatch({
                    type: BT.ANSWER_TYPE_SUCCESS,
                    payload: response.data
                });
            })
            .catch(error => {
                dispatch({
                    type: BT.ANSWER_TYPE_FAILURE,
                    payload: error,
                  });
            });
    };
}

const conversationSuccess = conversation => {
    return {
        type: BT.CONVERSATION_SUCCESS,
        payload: conversation
    };
};

const conversationFailure = error => {
    return {
        type: BT.CONVERSATION_FAILURE,
        payload: error
    };
};