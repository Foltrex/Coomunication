import * as UT from '../types/userTypes';
import axios from 'axios';

export const fetchUsers = () => {
    return dispatch => {
        dispatch({
            type: UT.FETCH_USERS_REQUEST
        });
        axios.get('http://localhost:8080/users')
            .then(response => {
                dispatch({
                    type: UT.USERS_SUCCESS,
                    payload: response.data
                });
            })
            .catch(error => {
                dispatch({
                    type: UT.USERS_FAILURE,
                    payload: error
                });
            });
    };
};

export const fetchUser = email => {
    return dispatch => {
        dispatch({
            type: UT.FETCH_USER_REQUEST
        });
        axios
            .get('http://localhost:8080/users/' + email)
            .then(response => {
                dispatch({
                    type: UT.USER_SUCCESS,
                    payload: response.data
                });
            })
            .catch(error => {
                dispatch({
                    type: UT.USER_FAILURE,
                    payload: error
                });
            });
    };
}

export const updateUser = user => {
    return dispatch => {
        dispatch({
            type: UT.UPDATE_USER_REQUEST
        });
        axios
            .put('http://localhost:8080/users', user)
            .then(response => {
                dispatch({
                    type: UT.USER_SUCCESS,
                    payload: response.data
                });

                localStorage.setItem('name', user.name);
                localStorage.setItem('surname', user.surname);
                localStorage.setItem('email', user.email);
            })
            .catch(error => {
                dispatch({
                    type: UT.USER_FAILURE,
                    payload: error
                });
            });
    };
}

export const deleteUser = id => {
    return dispatch => {
        dispatch({
            type: UT.DELETE_USER_REQUEST
        });
        axios
            .delete('http://localhost:8080/user/delete/' + id)
            .then(response => {
                dispatch({
                    type: UT.USER_SUCCESS,
                    payload: response.data
                });

                localStorage.clear();
            })
            .catch(error => {
                dispatch({
                    type: UT.USER_FAILURE,
                    payload: error
                });
            });
    }
}