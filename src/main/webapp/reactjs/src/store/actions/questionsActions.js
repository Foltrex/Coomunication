import {FETCH_QUESTIONS_REQUEST, FETCH_QUESTIONS_SUCCESS, FETCH_QUESTIONS_FAILURE} from '../types/questionTypes';
import axios from 'axios';

export const fetchQuestions = () => {
    return dispatch => {
        dispatch(fetchQuestionsRequest);
        axios.get('http://localhost:8080/questions')
            .then(response => {
                dispatch(fetchQuestionsSuccess(response.data));
            })
            .catch(error => {
                dispatch(fetchQuestionsFailure(error.message));
            });
    };
};

const fetchQuestionsRequest = () => {
    return {
        type: FETCH_QUESTIONS_REQUEST
    };
};

const fetchQuestionsSuccess = questions => {
    return {
        type: FETCH_QUESTIONS_SUCCESS,
        payload: questions
    };
};

const fetchQuestionsFailure = error => {
    return {
        type: FETCH_QUESTIONS_FAILURE,
        payload: error
    };
};