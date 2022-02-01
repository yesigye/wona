import { userActionTypes } from "../types";

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case userActionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };

    case userActionTypes.SET_UNAUTHENTICATED:
      return initialState;

    case userActionTypes.SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload,
      };

    case userActionTypes.SAVE_USER:
      return {
        ...state,
        credentials: action.payload,
      };

    // case LOADING_USER:
    //   return {
    //     ...state,
    //     loading: true,
    //   };

    // case LOADED_USER:
    //   return {
    //     ...state,
    //     loading: false,
    //   };

    default:
      return state;
  }
}
