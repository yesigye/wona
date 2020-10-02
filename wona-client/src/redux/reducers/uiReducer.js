import {
  SET_ALERTS,
  CLEAR_ALERTS,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
} from "../types";

const initialState = {
  loading: false,
  errors: null,
  alerts: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null,
      };

    case SET_ALERTS:
      return {
        ...state,
        loading: false,
        alerts: action.payload,
      };

    case CLEAR_ALERTS:
      return {
        ...state,
        loading: false,
        alerts: null,
      };

    case LOADING_UI:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}
