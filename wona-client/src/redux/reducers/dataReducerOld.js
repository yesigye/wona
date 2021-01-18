import { LOADING_DATA, SET_DOCTOR, SET_DOCTORS } from "../types";

const initialState = {
  loading: false,
  doctors: [],
  doctor: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };

    case SET_DOCTORS:
      return {
        ...state,
        loading: false,
        doctors: action.payload,
      };

    case SET_DOCTOR:
      return {
        ...state,
        loading: false,
        doctor: action.payload,
      };

    default:
      return state;
  }
}
