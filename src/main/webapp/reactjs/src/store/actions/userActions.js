import {FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILURE} from '../types/userTypes';
import axios from 'axios';

export const fetchUsers = () => {
    return dispatch => {
        dispatch(fetchUserRequest());
        axios.get('/users')
            .then(response => {
                dispatch(fetchUserSuccess(response.data));
            })
            .catch(error => {
                dispatch(fetchUserFailure(error.message));
            });
    };
};

const fetchUserRequest = () => {
    return {
        type: FETCH_USER_REQUEST
    };
};

const fetchUserSuccess = users => {
    return {
        type: FETCH_USER_SUCCESS,
        payload: users
    };
};

const fetchUserFailure = error => {
    return {
        type: FETCH_USER_FAILURE,
        payload: error
    };
};