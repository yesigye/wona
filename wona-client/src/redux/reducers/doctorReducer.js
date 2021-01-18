import { doctorActionTypes } from "../types";

const initErrors = {
  general: null,
  booking: null,
  payment: null,
};
const initialState = {
    data: {},
    appointment: {},
    bookingInProgress: false,
    paymentInProgress: false,
    loading: false,
    errors: initErrors
};

const doctorReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case doctorActionTypes.SET_DOCTOR:
      return {
        ...state,
        data: payload,
        errors: initErrors
      };
    default:
      return state;
  }
}

export default doctorReducer;
