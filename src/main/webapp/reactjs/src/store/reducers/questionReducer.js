import { SAVE_QUESTION_REQUEST, SAVE_QUESTION_SUCCESS, SAVE_QUESTION_FAILURE } from "../types/questionTypes";

const initialState = {
    question: '',
    error: ''
};

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case SAVE_QUESTION_REQUEST:
            return {
                ...state
            }
        case SAVE_QUESTION_SUCCESS:
            return {
                question: action.payload,
                error: ''
            };
        case SAVE_QUESTION_FAILURE:
            return {
                question: '',
                error: action.payload
            }
        default:
            return state;
    }
};

export default reducer;