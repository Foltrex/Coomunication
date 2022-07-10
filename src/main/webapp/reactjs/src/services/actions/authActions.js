import * as AT from '../types/authTypes';
import axios from 'axios';

const AUTH_URL = "http://localhost:8080/user/login";

export const authenticateUser = (email, password) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(AUTH_URL, {
      email: email,
      password: password,
    });
    
    const user = {
      name: response.data.name,
      surname: response.data.surname,
      email: response.data.email
    }

    localStorage.setItem('name', user.name);
    localStorage.setItem('surname', user.surname);
    localStorage.setItem('email', user.email);
    
    dispatch(success({user: user}));
    
    return Promise.resolve(response.data);
  } catch (error) {
    dispatch(failure());
    return Promise.reject(error);
  }
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(logoutRequest());
    localStorage.clear();
    dispatch(success({ user: '' }));
  };
};

const loginRequest = () => {
  return {
    type: AT.LOGIN_REQUEST,
  };
};

const logoutRequest = () => {
  return {
    type: AT.LOGOUT_REQUEST,
  };
};

const success = (user) => {
  return {
    type: AT.SUCCESS,
    payload: user,
  };
};

const failure = () => {
  return {
    type: AT.FAILURE,
    payload: '',
  };
};