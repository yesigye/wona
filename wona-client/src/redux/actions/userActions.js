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
import {
  startAction,
  stopAction,
  setError,
  clearError,
  setNotification,
  clearNotification,
} from "./uiActions";
import axios from "axios";
import { isLoading, getErrors } from "../selectors";
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
      reduceNetworkErrors(dispatch, userActionTypes.SET_USER, error);
    });
};

export const getUserData = () => (dispatch) => {
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: userActionTypes.SET_USER,
        payload: res.data,
      });
    })
    .catch((err) =>
      reduceNetworkErrors(dispatch, userActionTypes.SET_USER, err)
    );
};

export const editUserDetails = (userDetails) => async (dispatch) => {
  dispatch(clearError(userActionTypes.SET_USER));
  dispatch(clearNotification(userActionTypes.SET_USER));
  dispatch(startAction(userActionTypes.SET_USER));
  try {
    await axios.post("/user", userDetails);
    dispatch(getUserData());
    dispatch(
      setNotification(userActionTypes.SET_USER, "Profile has been updated")
    );
    dispatch(stopAction(userActionTypes.SET_USER));
  } catch (error) {
    reduceNetworkErrors(dispatch, userActionTypes.SET_USER, error);
    dispatch(stopAction(userActionTypes.SET_USER));
  }
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
      reduceNetworkErrors(dispatch, userActionTypes.SET_USER, error);
    });
};

/**
 * Unauthenticate user and remove Token.
 * @param {string} reason message to indicate why token expired
 */
export const logoutUser = (reason) => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: userActionTypes.SET_UNAUTHENTICATED });
  if (reason === "expired") {
    dispatch(
      setError(userActionTypes.SET_USER, {
        login: "Your session has expired. Please login",
      })
    );
  }
};

export const getLoginErrors = (state) => (dispatch) => {
  return dispatch(getErrors(userActionTypes.SET_USER, state));
};

export const isLoggingIn = () => (dispatch) => {
  return dispatch(isLoading(userActionTypes.SET_USER));
};

/**
 * Save token in local storage & set it for future axios requests
 * @param {string} token Bearer token
 */
const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};

const reduceNetworkErrors = (dispatch, action, error) => {
  let payload = {};
  if (error.message === "Network Error") {
    payload.message = "No internet connection";
  } else if (error.response !== undefined) {
    payload = error.response.data;
  }
  Object.keys(payload).length !== 0 && dispatch(setError(action, payload));
};
