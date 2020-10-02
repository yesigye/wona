import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_ALERTS,
  CLEAR_ALERTS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LOADED_USER,
} from "../types";
import axios from "axios";

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((error) => {
      dispatch({
        type: SET_ERRORS,
        payload: {
          type: "error",
          message:
            error.message === "Network Error"
              ? "No internet connection"
              : "Something went wrong. Try again later",
        },
      });
    });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const editUserDetails = (userDetails) => async (dispatch) => {
  dispatch({ type: CLEAR_ALERTS });
  dispatch({ type: LOADING_USER });

  try {
    await axios.post("/user", userDetails);
    dispatch({
      type: SET_ALERTS,
      payload: { type: "success", message: "Profile updated successfully" },
    });
    dispatch(getUserData());
    dispatch({ type: LOADED_USER });
  } catch (error) {
    dispatch({
      type: SET_ALERTS,
      payload: {
        type: "error",
        message:
          error.message === "Network Error"
            ? "No internet connection"
            : "Something went wrong. Try again later",
      },
    });
    dispatch({ type: LOADED_USER });
  }
};

export const uploadPhoto = (formData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/user/image", formData)
    .then(() => {
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch((err) => console.log(err));
};

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((error) => {
      dispatch({
        type: SET_ERRORS,
        payload: {
          type: "error",
          message:
            error.message === "Network Error"
              ? "No internet connection"
              : "Something went wrong. Try again later",
        },
      });
    });
};

// Delete token in local storage and
// remove bearer token from axios default headers
export const logoutUser = (reason) => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
  if (reason === "expired") {
    dispatch({
      type: SET_ERRORS,
      payload: { login: "Your session has expired. Please login" },
    });
  }
};

// Save token in local storage and
// attach bearer token to future axios requests
const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
