import { doctorsActionTypes } from "../types";
import { startAction, stopAction } from "./uiActions";
import demoDoctors from "../../services/fake-doctors.json";
// import axios from "axios";

// Get all doctors
export const getDoctors = () => (dispatch) => {
  dispatch(startAction(doctorsActionTypes.GET_DOCTORS, true));
  dispatch({
    type: doctorsActionTypes.GET_DOCTORS,
    payload: demoDoctors,
  });
  dispatch({ type: doctorsActionTypes.GET_DOCTORS_DONE });
  //   axios
  //     .get("/doctors")
  //     .then((response) => {
  //       dispatch({
  //         type: SET_DOCTORS,
  //         payload: response.data,
  //       });
  //     })
  //     .catch((err) => {
  //       dispatch({
  //         type: SET_DOCTORS,
  //         payload: [],
  //       });
  //     });
};

export const filterDoctors = (filter, value) => (dispatch) => {
  let filtered = [];
  if (filter === "department") {
    filtered = demoDoctors ? demoDoctors.filter(d => d.department === value) : demoDoctors;
  }
  dispatch({
    type: doctorsActionTypes.UPDATE_DOCTORS,
    payload: filtered,
  });
};