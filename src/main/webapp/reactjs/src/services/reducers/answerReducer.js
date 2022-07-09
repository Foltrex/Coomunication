import * as AT from '../types/answerTypes';

const initialState = {
    answer: '',
    types: [],
    error: ''
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case AT.FETCH_ANSWER_TYPE_REQUEST:
            return {
                ...state
            };
        case AT.ANSWER_TYPE_SUCCESS:
            return {
                types: action.payload,
                error: ''
            }
        case AT.ANSWER_TYPE_FAILURE:
            return {
                types: '',
                error: action.payload
            }
        default:
            return state;
    }
}

export default reducer;