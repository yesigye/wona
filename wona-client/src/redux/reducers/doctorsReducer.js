import { doctorsActionTypes } from "../types";

const initialState = {
  loading: false,
  data: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case doctorsActionTypes.GET_DOCTORS:
      return {
        ...state,
        loading: true,
        data: action.payload,
      };

    case doctorsActionTypes.GET_DOCTORS_DONE:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
}
