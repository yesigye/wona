import { doctorActionTypes } from "../types";
import {
  startAction,
  stopAction,
  setError,
  clearError,
  setNotification,
  clearNotification,
} from "./uiActions";
import demoDoctors from "../../services/fake-doctors.json";
import axios from "axios";
import { setNetworkErrors } from "./utility";

export const getDoctor = (id) => (dispatch) => {
  dispatch({
    type: doctorActionTypes.SET_DOCTOR,
    payload: demoDoctors.find((doc) => doc.doctorId === id),
  });
};

/**
 * Set appointment details to state.
 * @param {object} appointment appointment details
 */
export const setAppointment = (appointment) => (dispatch) => {
  dispatch({
    type: doctorActionTypes.SET_APPOINTMENT,
    payload: appointment,
  });
};
/**
 * Save appointment permanently to data store.
 * @param {object} appointment appointment details
 */
export const saveAppointment = (appointment) => (dispatch) => {
  dispatch(startAction(doctorActionTypes.SAVE_APPOINTMENT));

  axios
    .post("/appointment", appointment)
    .then((res) => {
      dispatch({ type: doctorActionTypes.SAVE_APPOINTMENT });
    })
    .catch((err) => {
      console.log(appointment, err.response.data);
      setNetworkErrors(dispatch, doctorActionTypes.SAVE_APPOINTMENT, err);
      // dispatch({
      //   type: doctorActionTypes.SAVE_APPOINTMENT_ERROR,
      //   payload: true
      // });
    })
    .then(() => {
      dispatch(stopAction(doctorActionTypes.SAVE_APPOINTMENT));
    });
};
