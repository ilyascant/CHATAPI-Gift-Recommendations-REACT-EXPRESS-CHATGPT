export const AIActionType = {
  SET_RECIPIENT: "SET_RECIPIENT",
  SET_MESSAGES: "SET_MESSAGES",
  SET_USER_INFO: "SET_USER_INFO",
  SET_USER_PASSWORD: "SET_USER_PASSWORD",
};

const reducer = (state, action) => {
  switch (action.type) {
    case AIActionType.SET_RECIPIENT:
      return { ...state, recipient: action.recipient };
    case AIActionType.SET_MESSAGES:
      return { ...state, messages: action.messages };
    case AIActionType.SET_USER_INFO:
      return { ...state, userInfo: action.userInfo };
    case AIActionType.SET_USER_PASSWORD:
      return { ...state, password: action.password };
    default:
      return state;
  }
};

export default reducer;
