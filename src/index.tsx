import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./components/App";
import Rules from "./components/Rules";
import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" Component={App} />
            <Route path="/rules" Component={Rules} />
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
