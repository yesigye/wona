export const getErrors = (store, action) => {
  const actions = store.UI.errors.actions;
  if (actions.length === 0) return;
  const actionData = actions.find((e) => e.name === action);
  return actionData ? actionData.params : {};
};

export const getNotifications = (store, action) => {
  const actions = store.UI.notifications.actions;

  if (actions.length === 0) return;

  return actions.find((e) => e.name === action).params;
};

export const isLoading = (store, action) => {
  const actions = store.UI.loader.actions;

  if (actions.length === 0) return false;

  return actions.some((e) => e.name === action);
};
