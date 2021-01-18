import { doctorActionTypes } from "../types";
import demoDoctors from "../../services/fake-doctors.json";
// import axios from "axios";

export const getDoctor = (id) => (dispatch) => {
  dispatch({
    type: doctorActionTypes.SET_DOCTOR,
    payload: demoDoctors.find((doc) => doc.doctorId === id),
  });
};

/**
 * Saving an appointment
 * @param {object} appointment Appointment details object
 */
// export const saveAppointment = (appointment) => (dispatch) => {
//   dispatch({ type: SET_APPOINTMENT, payload: appointment });
//   dispatch({ type: SET_APPOINTMENT, payload: appointment });
  
//   try {
//     await axios.post("/appointments", appointment);
//     dispatch({ type: SET_APPOINTMENT, payload: {} });
//   } catch (error) {
//     dispatch({
//       type: SET_APPOINTMENT_ERROR,
//       payload: {
//         type: "error",
//         message:
//           error.message === "Network Error"
//             ? "No internet connection"
//             : "Something went wrong. Try again later",
//       },
//     });
//     dispatch({ type: LOADED_USER });
//   }
// };