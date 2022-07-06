import * as CT from "../types/conversationTypes";

const initialState = {
    pagination: '',
    conversation: '',
    error: ''
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case CT.SAVE_CONVERSATION_REQUEST:
        case CT.FETCH_CONVERSATION_REQUEST:
        case CT.FETCH_CONVERSATIONS_REQUEST:
            return {
                ...state
            }
        case CT.CONVERSATION_SUCCESS:
            return {
                conversation: action.payload,
                error: ''
            };
        case CT.CONVERSATION_FAILURE:
            return {
                conversation: '',
                error: action.payload
            };
        case CT.CONVERSATIONS_SUCCESS:
            return {
                pagination: action.payload,
                error: ''
            };
        case CT.CONVERSATIONS_FAILURE:
            return {
                pagination: '',
                error: action.payload
            }
        default:
            return state;
    }
};

export default reducer;