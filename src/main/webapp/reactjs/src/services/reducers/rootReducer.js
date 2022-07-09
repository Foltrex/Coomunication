import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import conversationReducer from './conversationReducer';
import answerReducer from './answerReducer';

const rootReducer = combineReducers({
    user: userReducer,
    conversation: conversationReducer,
    auth: authReducer,
    answer: answerReducer
});

export default rootReducer;