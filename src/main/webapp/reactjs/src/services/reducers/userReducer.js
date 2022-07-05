import * as UT from '../types/userTypes';

const initialState = {
    user: '',
    users: [],
    error: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case UT.FETCH_USERS_REQUEST:
        case UT.FETCH_USER_REQUEST:
        case UT.UPDATE_USER_REQUEST:
            return {
                ...state
            };
        case UT.USERS_SUCCESS:
            return {
                users: action.payload,
                error: ''
            };
        case UT.USERS_FAILURE:
            return {
                users: [],
                error: action.payload
            };
        case UT.USER_SUCCESS:
            return {
                user: action.payload,
                error: ''
            };
        case UT.USER_FAILURE: {
            return {
                user: '',
                error: action.payload
            };
        }
        default:
            return state;
    }
};

export default reducer;