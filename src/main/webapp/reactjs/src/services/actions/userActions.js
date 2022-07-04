import * as UT from '../types/userTypes';
import axios from 'axios';

export const fetchUsers = () => {
    return dispatch => {
        dispatch(fetchUserRequest());
        axios.get('http://localhost:8080/users')
            .then(response => {
                dispatch(userSuccess(response.data));
            })
            .catch(error => {
                dispatch(userFailure(error.message));
            });
    };
};

const fetchUserRequest = () => {
    return {
        type: UT.FETCH_USER_REQUEST
    };
};

const userSuccess = users => {
    return {
        type: UT.USER_SUCCESS,
        payload: users
    };
};

const userFailure = error => {
    return {
        type: UT.USER_FAILURE,
        payload: error
    };
};