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
  errors: initErrors,
};

const doctorReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case doctorActionTypes.SET_DOCTOR:
      return {
        ...state,
        data: payload,
        errors: initErrors,
      };
    case doctorActionTypes.SET_APPOINTMENT:
      return {
        ...state,
        appointment: { ...state.appointment, ...payload },
      };
    case doctorActionTypes.SAVE_APPOINTMENT:
      return {
        ...state,
        bookingInProgress: true,
      };
    case doctorActionTypes.SAVE_APPOINTMENT_DONE:
      return {
        ...state,
        bookingInProgress: false,
        appointment: {},
        errors: initErrors,
      };
    case doctorActionTypes.SAVE_APPOINTMENT_ERROR:
      return {
        ...state,
        bookingInProgress: false,
        errors: { ...state.errors, ...payload },
      };
    default:
      return state;
  }
};

export default doctorReducer;
