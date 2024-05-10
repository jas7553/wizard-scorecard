import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import Rules from "./components/Rules";
import rootReducer from "./reducers";
import NewGame from "./components/NewGame";
import Nav from "./components/Nav";
import Game from "./components/Game";
import NotFound from "./components/NotFound";

const store = configureStore({
  reducer: rootReducer,
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/new" element={<NewGame />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
