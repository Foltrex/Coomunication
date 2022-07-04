import * as BT from "../types/conversationTypes";

const initialState = {
    conversation: '',
    error: ''
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case BT.SAVE_CONVERSATION_REQUEST:
        case BT.FETCH_CONVERSATION_REQUEST:
            return {
                ...state
            }
        case BT.CONVERSATION_SUCCESS:
            return {
                conversation: action.payload,
                error: ''
            };
        case BT.CONVERSATION_FAILURE:
            return {
                conversation: '',
                error: action.payload
            };
        case BT.ANSWER_TYPE_SUCCESS:
            return {
                answerTypes: action.payload,
                error: ''
            };
        case BT.ANSWER_TYPE_FAILURE:
            return {
                answerTypes: '',
                error: action.payload
            };
        default:
            return state;
    }
};

export default reducer;