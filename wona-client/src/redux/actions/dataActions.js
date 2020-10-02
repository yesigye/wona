import { LOADING_DATA, SET_DOCTOR, SET_DOCTORS } from "../types";
import demoDoctors from "../../services/fake-doctors.json";
// import axios from "axios";

// Get all doctors
export const getDoctors = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({
    type: SET_DOCTORS,
    payload: demoDoctors,
  });
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

export const getDoctor = (id) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  dispatch({
    type: SET_DOCTOR,
    payload: demoDoctors.find((doc) => doc.doctorId === id),
  });
};
