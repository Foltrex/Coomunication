import axios from 'axios';
import * as AT from '../types/answerTypes';

export const fetchAnswerTypes = () => {
    return dispatch => {
        dispatch({
            type: AT.FETCH_ANSWER_TYPE_REQUEST
        });
        axios.get('http://localhost:8080/answer/types')
            .then(response => {
                dispatch(answerSuccess(response.data));
            })
            .catch(error => {
                dispatch(answerFailure(error));
            });
    };
};


const answerSuccess = answer => {
    return {
        type: AT.ANSWER_TYPE_SUCCESS,
        payload: answer
    };
};

const answerFailure = error => {
    return {
        type: AT.ANSWER_TYPE_FAILURE,
        payload: error
    };
};