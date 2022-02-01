import { uiActionTypes } from "../types";

const initialState = {
  loader: { actions: [], refreshing: [] },
  errors: { actions: [] },
  notifications: { actions: [] },
};

const uiReducer = (state = initialState, { type, payload }) => {
  const { loader, errors, notifications } = state;
  // const { actions, refreshing, errors, notifications } = loader;

  switch (type) {
    case uiActionTypes.START_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: [...loader.actions, payload.action],
        },
      };
    case uiActionTypes.STOP_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: loader.actions.filter(
            (action) => action.name !== payload.name
          ),
        },
      };
    case uiActionTypes.REFRESH_ACTION_START:
      return {
        ...state,
        loader: {
          ...loader,
          refreshing: [...loader.refreshing, payload.refreshAction],
        },
      };
    case uiActionTypes.REFRESH_ACTION_STOP:
      return {
        ...state,
        loader: {
          ...loader,
          refreshing: loader.refreshing.filter(
            (refresh) => refresh !== payload.refreshAction
          ),
        },
      };
    case uiActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...errors,
          actions: [...errors.actions, payload.action],
        },
      };
    case uiActionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...errors,
          actions: errors.actions.filter(
            (action) => action.name !== payload.name
          ),
        },
      };
    case uiActionTypes.SET_NOTIFICATION:
      return {
        ...state,
        notifications: {
          ...notifications,
          actions: [...notifications.actions, payload.action],
        },
      };
    case uiActionTypes.CLEAR_NOTIFICATION:
      return {
        ...state,
        notifications: {
          ...notifications,
          actions: notifications.actions.filter(
            (action) => action.name !== payload.name
          ),
        },
      };
    default:
      return state;
  }
};

export default uiReducer;
