// import {
//   SET_USER,
//   SET_ERRORS,
//   CLEAR_ERRORS,
//   SET_ALERTS,
//   CLEAR_ALERTS,
//   LOADING_UI,
//   SET_UNAUTHENTICATED,
//   LOADING_USER,
//   LOADED_USER,
// } from "../types";
import { userActionTypes } from "../types";
import { startAction, stopAction, setError, clearError } from "./uiActions";
import axios from "axios";
import {isLoading, getErrors } from "../selectors";
import { validateLoginData, validateSignupData } from "./validators";

/**
 * Temp save user credentials until signin/sigup is commplete.
 * @param {object} userData {email, password}
 */
export const saveUserData = (userData) => (dispatch) => {
  dispatch({
    type: userActionTypes.SAVE_USER,
    payload: userData,
  });
};

export const signupUser = (newUserData, history, redirect) => (dispatch) => {
  dispatch(clearError(userActionTypes.SET_USER));
  dispatch(startAction(userActionTypes.SET_USER, true));
  
  const validator = validateSignupData(newUserData);
  
  if (!validator.valid) {
    dispatch(stopAction(userActionTypes.SET_USER));
    dispatch(setError(userActionTypes.SET_USER, validator.errors));
    return;
  }

  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch(stopAction(userActionTypes.SET_USER));
      redirect !== undefined && redirect && history.push(redirect);
    })
    .catch((error) => {
      dispatch(stopAction(userActionTypes.SET_USER));
      setNetworkErrors(dispatch, userActionTypes.SET_USER, error);
    });
};

export const getUserData = () => (dispatch) => {
  // dispatch({ type: LOADING_USER });
  // axios
  //   .get("/user")
  //   .then((res) => {
  //     dispatch({
  //       type: SET_USER,
  //       payload: res.data,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => async (dispatch) => {
  // dispatch({ type: CLEAR_ALERTS });
  // dispatch({ type: LOADING_USER });

  // try {
  //   await axios.post("/user", userDetails);
  //   dispatch({
  //     type: SET_ALERTS,
  //     payload: { type: "success", message: "Profile updated successfully" },
  //   });
  //   dispatch(getUserData());
  //   dispatch({ type: LOADED_USER });
  // } catch (error) {
  //   dispatch({
  //     type: SET_ALERTS,
  //     payload: {
  //       type: "error",
  //       message:
  //         error.message === "Network Error"
  //           ? "No internet connection"
  //           : "Something went wrong. Try again later",
  //     },
  //   });
  //   dispatch({ type: LOADED_USER });
  // }
};

export const uploadPhoto = (formData) => (dispatch) => {
  // dispatch({ type: LOADING_UI });
  // axios
  //   .post("/user/image", formData)
  //   .then(() => {
  //     dispatch(getUserData());
  //     dispatch({ type: CLEAR_ERRORS });
  //   })
  //   .catch((err) => console.log(err));
};

/**
 * Authenticate user and get Token.
 * @param {object} userData {email, password}
 * @param {object} history
 * @param {string} redirect next page to go
 */
export const loginUser = (userData, history, redirect) => (dispatch) => {
  dispatch(clearError(userActionTypes.SET_USER));
  dispatch(startAction(userActionTypes.SET_USER, true));

  const validator = validateLoginData(userData);
  
  if (!validator.valid) {
    dispatch(stopAction(userActionTypes.SET_USER));
    dispatch(setError(userActionTypes.SET_USER, validator.errors));
    return;
  }
  
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch(stopAction(userActionTypes.SET_USER));
      history.push(redirect ? redirect : "/");
    })
    .catch((error) => {
      dispatch(stopAction(userActionTypes.SET_USER));
      setNetworkErrors(dispatch, userActionTypes.SET_USER, error);
    });
};

/**
 * Unauthenticate user and remove Token.
 * @param {string} reason message to indicate why token expired
 */
export const logoutUser = (reason) => (dispatch) => {
  // localStorage.removeItem("FBIdToken");
  // delete axios.defaults.headers.common["Authorization"];
  // dispatch({ type: SET_UNAUTHENTICATED });
  // if (reason === "expired") {
  //   dispatch({
  //     type: SET_ERRORS,
  //     payload: { login: "Your session has expired. Please login" },
  //   });
  // }
};

export const getLoginErrors = (state) => (dispatch) => {
  return dispatch(getErrors(userActionTypes.SET_USER, state));
};

export const isLoggingIn = () => dispatch => {
  return dispatch(isLoading(userActionTypes.SET_USER));
};

// Save token in local storage and
// attach bearer token to future axios requests
const setAuthorizationHeader = (token) => {
  // const FBIdToken = `Bearer ${token}`;
  // localStorage.setItem("FBIdToken", FBIdToken);
  // axios.defaults.headers.common["Authorization"] = FBIdToken;
};

const setNetworkErrors = (dispatch, action, error) => {
  let message = "";

  if (error.message === "Network Error") {
    // Catch network errors
    message = "No internet connection";
  }
  if (error.response !== undefined) {
    // Catch errors from server
    message = error.response.data;
  }

  message && dispatch(setError(action, {message}));
}