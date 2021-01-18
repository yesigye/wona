import store from "./store";

export const getErrors = (action, state) => (dispatch) => {
    const actions = state.UI.errors.actions;
    
    if(actions.length === 0) return;

    return actions.find(e => e.name === action).params;
};

export const isLoading = action => dispatch => {
    const actions = store.getState().UI.loader.actions;
    
    if(actions.length === 0) return;

    return actions.find(e => e.name === action).params;
};