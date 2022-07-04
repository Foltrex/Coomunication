import * as UT from '../types/userTypes';

const initialState = {
    users: [],
    error: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UT.FETCH_USER_REQUEST:
            return {
                ...state
            };
        case UT.USER_SUCCESS:
            return {
                users: action.payload,
                error: ''
            };
        case UT.USER_FAILURE:
            return {
                users: [],
                error: action.payload
            };
        default:
            return state;
    }
};

export default reducer;