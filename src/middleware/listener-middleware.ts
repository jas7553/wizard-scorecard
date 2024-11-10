import { createListenerMiddleware } from "@reduxjs/toolkit";

import { RootState } from "..";
import {
  getFromStorage,
  getPlayersFromStorage,
  LocalStorageKeys,
} from "../storage";
import { Round } from "../types";

export const listenerMiddleware = createListenerMiddleware();
listenerMiddleware.startListening({
  predicate: (_, currentState: RootState, previousState: RootState) => {
    return (
      currentState.players !== previousState.players ||
      currentState.scorecard !== previousState.scorecard
    );
  },
  effect: (_, listenerApi) => {
    const dealerId = (listenerApi.getState() as RootState).players.dealerId;
    if (dealerId) {
      localStorage.setItem(LocalStorageKeys.dealerId, JSON.stringify(dealerId));
    }
    const players = (listenerApi.getState() as RootState).players.players;
    if (players) {
      localStorage.setItem(LocalStorageKeys.players, JSON.stringify(players));
    }
    const rounds = (listenerApi.getState() as RootState).scorecard.rounds;
    if (rounds) {
      localStorage.setItem(LocalStorageKeys.rounds, JSON.stringify(rounds));
    }
  },
});

export const preloadedState = () => {
  return {
    players: {
      dealerId: getFromStorage<string>(LocalStorageKeys.dealerId),
      players: getPlayersFromStorage() || {},
    },
    scorecard: {
      rounds: getFromStorage<Array<Round>>(LocalStorageKeys.rounds),
    },
  };
};

export default listenerMiddleware.middleware;
