import { setError } from "./uiActions";

/**
 * Set network error to redux store
 * @param {String} action redux action type
 * @param {Function} dispatch redux state updater call
 * @param {Object} error network error object
 */
export function setNetworkErrors(dispatch, action, error) {
  let payload = {};
  if (error.message === "Network Error") {
    payload.message = "No internet connection";
  } else if (
    error.response !== undefined &&
    typeof error.response.data === "object"
  ) {
    payload = error.response.data;
  } else {
    payload.message = "Oops, something went wrong";
  }

  Object.keys(payload).length !== 0 && dispatch(setError(action, payload));
}
