import { ChakraProvider } from "@chakra-ui/react";
import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react";
import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Game from "./components/Game";
import Home from "./components/Home";
import NewGame from "./components/NewGame";
import NotFound from "./components/NotFound";
import Rules from "./components/Rules";
import playersReducer from "./features/players";
import scorecardReducer from "./features/scorecard";
import listenerMiddleware, {
  preloadedState,
} from "./middleware/listener-middleware";

export const store = configureStore({
  reducer: {
    players: playersReducer,
    scorecard: scorecardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware),
  preloadedState: preloadedState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider value={defaultSystem}>
          <Box>
            <nav>
              <Link to={"/"} />
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/game/new" element={<NewGame />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
