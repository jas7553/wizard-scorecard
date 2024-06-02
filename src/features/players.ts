import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { Player } from "../types";

interface PlayerState {
  dealerId?: string;
  players: Record<string, Player>;
}

export const createPlayer = (name: string): Player => {
  return {
    name,
    id: uuidv4(),
  };
};

const initialState: PlayerState = {
  dealerId: undefined,
  players: {},
};

const slice = createSlice({
  name: "players",
  initialState,
  reducers: {
    setDealerId: (state, action: PayloadAction<string>) => {
      state.dealerId = action.payload;
    },
    removeDealer: (state) => {
      state.dealerId = null;
    },
    advanceDealer: (state) => {
      const playerIds = Object.keys(state.players);
      state.dealerId =
        playerIds[(playerIds.indexOf(state.dealerId) + 1) % playerIds.length];
    },
    unadvanceDealer: (state) => {
      const playerIds = Object.keys(state.players);
      state.dealerId =
        playerIds[(playerIds.indexOf(state.dealerId) - 1) % playerIds.length];
    },
    setPlayers: (state, action: PayloadAction<Record<string, Player>>) => {
      state.players = action.payload;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players[action.payload.id] = action.payload;

      if (Object.values(state.players).length === 1) {
        state.dealerId = action.payload.id;
      }
    },
    removePlayer: (state, action: PayloadAction<string>) => {
      delete state.players[action.payload];
    },
  },
});

export const {
  setDealerId,
  removeDealer,
  advanceDealer,
  unadvanceDealer,
  setPlayers,
  addPlayer,
  removePlayer,
} = slice.actions;

export default slice.reducer;
