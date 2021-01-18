import { uiActionTypes } from '../types';

const initialState = {
  loader: {
    actions: [],
    refreshing: [],
  },
  errors: {
    actions: []
  },
};

const uiReducer = (state = initialState, { type, payload }) => {
  const { loader } = state;
  const { actions, refreshing, errors } = loader;
  switch (type) {
    case uiActionTypes.START_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: [...actions, payload.action]
        }
      };
    case uiActionTypes.STOP_ACTION:
      return {
        ...state,
        loader: {
          ...loader,
          actions: actions.filter(action => action.name !== payload.name)
        }
      };
    case uiActionTypes.REFRESH_ACTION_START:
      return {
        ...state,
        loader: {
          ...loader,
          refreshing: [...refreshing, payload.refreshAction]
        }
      };
    case uiActionTypes.REFRESH_ACTION_STOP:
      return {
        ...state,
        loader: {
          ...loader,
          refreshing: refreshing.filter(refresh => refresh !== payload.refreshAction)
        }
      };
    case uiActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...errors,
          actions: [...actions, payload.action]
        }
      };
    case uiActionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...errors,
          actions: actions.filter(action => action.name !== payload.name)
        }
      };
    default:
      return state;
  }
};

export default uiReducer;