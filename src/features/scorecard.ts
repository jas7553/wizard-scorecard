import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Player, Round } from "../types";

interface ScorecardState {
  rounds: Array<Round>;
}

const initialState: ScorecardState = {
  rounds: [],
};

const roundFromPlayers = (players: Record<string, Player>) => {
  return Object.fromEntries(
    Object.values(players).map((player) => {
      return [
        player.id,
        {
          player: player,
        },
      ];
    }),
  );
};

const scorecardSlice = createSlice({
  name: "scorecard",
  initialState,
  reducers: {
    freshScorecard: (state, action: PayloadAction<Record<string, Player>>) => {
      state.rounds = [roundFromPlayers(action.payload)];
    },
    addRound: (state, action: PayloadAction<Record<string, Player>>) => {
      state.rounds.push(roundFromPlayers(action.payload));
    },
    confirmBets: (state, action: PayloadAction<Record<string, number>>) => {
      const round = state.rounds[state.rounds.length - 1];
      Object.values(round).forEach((cell) => {
        cell.bet = action.payload[cell.player.id];
      });
    },
    confirmTricks: (state, action: PayloadAction<Record<string, number>>) => {
      const round = state.rounds[state.rounds.length - 1];
      Object.values(round).forEach((cell) => {
        cell.got = action.payload[cell.player.id];
        cell.score =
          cell.bet === action.payload[cell.player.id]
            ? 20 + action.payload[cell.player.id] * 10
            : -10 * action.payload[cell.player.id];
      });
    },
    undoLastBets: (state) => {
      const round = state.rounds[state.rounds.length - 1];
      Object.values(round).forEach(
        (cell) => delete cell.bet,
      );
    },
    undoLastTricks: (state) => {
      const round = state.rounds[state.rounds.length - 1];
      Object.values(round).forEach(
        (cell) => {
          delete cell.got;
          delete cell.score;
        }
      );
    },
    undoLastRound: (state) => {
      state.rounds.pop();
    }
  },
});

export const {
  addRound,
  confirmBets,
  confirmTricks,
  freshScorecard,
  undoLastBets,
  undoLastTricks,
  undoLastRound
} = scorecardSlice.actions;

export default scorecardSlice.reducer;
