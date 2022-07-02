import axios from 'axios';
import {SAVE_QUESTION_REQUEST, SAVE_QUESTION_SUCCESS, SAVE_QUESTION_FAILURE} from '../types/questionTypes';

export const saveQuestion = question => {
    return dispatch => {
        dispatch(saveQuestionRequest());
        axios.post('http://localhost:8080/question/save', question)
            .then(response => {
                dispatch(saveQuestionSuccess(response.data));
            })
            .catch(error => {
                dispatch(saveQuestionFailure(error));
            });
    };
};

const saveQuestionRequest = () => {
    return {
        type: SAVE_QUESTION_REQUEST
    };
};

const saveQuestionSuccess = question => {
    return {
        type: SAVE_QUESTION_SUCCESS,
        payload: question
    };
};

const saveQuestionFailure = error => {
    return {
        type: SAVE_QUESTION_FAILURE,
        payload: error
    };
};

