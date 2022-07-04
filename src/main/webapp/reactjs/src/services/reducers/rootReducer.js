import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import conversationReducer from './conversationReducer';

const rootReducer = combineReducers({
    user: userReducer,
    conversation: conversationReducer,
    auth: authReducer,
});

export default rootReducer;