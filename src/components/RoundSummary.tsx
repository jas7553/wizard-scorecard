import React from "react";
import { GameState, NewGameState } from "../types";

interface RoundSummaryProps {
  state: GameState;
}

export default function RoundSummary({ state }: RoundSummaryProps) {
  return state.players.map((player) => {
    return (
      <p key={player.id}>
        Player: {player.name}, Score: {player.score}, Dealer:{" "}
        {player.id === state.dealerId ? "Y" : "N"}
      </p>
    );
  });
}
