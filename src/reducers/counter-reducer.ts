const initialState = {
  count: 0,
};

interface Action {
  type: string;
}

const counterReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

export default counterReducer;
