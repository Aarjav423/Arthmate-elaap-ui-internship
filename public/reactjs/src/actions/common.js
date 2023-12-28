export const setAlert = (hidden, message, type, title, resolve, reject) => ({
  type: "SET_ALERT_POPUP",
  resolve: () => {},
  reject : () => {},
  payload: {
    hidden,
    message,
    type,
    title,
  },
});
