import { uiActionTypes } from "../types";

export const startAction = (name, params) => ({
  type: uiActionTypes.START_ACTION,
  payload: {
    action: {
      name,
      params,
    },
  },
});

export const stopAction = (name) => ({
  type: uiActionTypes.STOP_ACTION,
  payload: { name },
});

export const refreshActionStart = (refreshAction) => ({
  type: uiActionTypes.REFRESH_ACTION_START,
  payload: { refreshAction },
});

export const refreshActionStop = (refreshAction) => ({
  type: uiActionTypes.REFRESH_ACTION_STOP,
  payload: { refreshAction },
});

export const setError = (name, params) => ({
  type: uiActionTypes.SET_ERROR,
  payload: {
    action: { name, params },
  },
});

export const clearError = (name) => ({
  type: uiActionTypes.CLEAR_ERROR,
  payload: { name },
});

export const setNotification = (name, params) => ({
  type: uiActionTypes.SET_NOTIFICATION,
  payload: {
    action: { name, params },
  },
});

export const clearNotification = (name) => ({
  type: uiActionTypes.CLEAR_NOTIFICATION,
  payload: { name },
});
