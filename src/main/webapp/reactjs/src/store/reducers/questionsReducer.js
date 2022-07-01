import {FETCH_QUESTIONS_REQUEST, FETCH_QUESTIONS_SUCCESS, FETCH_QUESTIONS_FAILURE} from '../types/questionTypes';


const initialState = {
    questions: [],
    error: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_QUESTIONS_REQUEST:
            return {
                ...state
            };
        case FETCH_QUESTIONS_SUCCESS:
            return {
                questions: action.payload,
                error: ''
            };
        case FETCH_QUESTIONS_FAILURE:
            return {
                questions: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default reducer;