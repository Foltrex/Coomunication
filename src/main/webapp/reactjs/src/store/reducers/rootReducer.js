import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import questionReducer from './questionReducer';
import questionsReducer from './questionsReducer';

const rootReducer = combineReducers({
    user: userReducer,
    questions: questionsReducer,
    question: questionReducer,
    auth: authReducer,
});

export default rootReducer;