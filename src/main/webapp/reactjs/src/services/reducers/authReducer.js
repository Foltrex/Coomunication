import { LOGIN_REQUEST, LOGOUT_REQUEST, SUCCESS, FAILURE } from "../types/authTypes";

const initialState = {
  user: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case LOGOUT_REQUEST:
      return {
        ...state,
      };
    case SUCCESS:
    case FAILURE:
      return {
        user: action.payload.user
      };
    default:
      return state;
  }
};

export default reducer;