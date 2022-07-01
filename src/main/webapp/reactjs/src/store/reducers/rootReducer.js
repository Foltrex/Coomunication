import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import questionReducer from './questionReducer';

const rootReducer = combineReducers({
    user: userReducer,
    questions: questionReducer,
    auth: authReducer,
});

export default rootReducer;