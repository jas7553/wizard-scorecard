import { combineReducers } from "@reduxjs/toolkit";

import counterReducer from "./counter-reducer";

export default combineReducers({
  counter: counterReducer,
});
