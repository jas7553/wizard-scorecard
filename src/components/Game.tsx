import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { GameState } from "../types";
import RoundSummary from "./RoundSummary";

interface Row {
  player: string;
  bet: number;
  got: number;
}

interface Round {
  rows: Array<Row>;
}

function getGameStateFromStorage(): GameState | null {
  const localStorageState = localStorage.getItem("gameState");
  if (!localStorageState) {
    return null;
  }

  const gameState: GameState = JSON.parse(localStorageState);

  return {
    ...gameState,
    players: gameState.players.map((player) => ({
      ...player,
      score: 0,
    })),
  };
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(
    getGameStateFromStorage(),
  );
  const [rounds, setRounds] = useState<Array<Round>>([]);
  const [enteringBids, setEnteringBids] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }, [gameState]);

  if (!gameState) {
    return <Navigate replace to={"/new"} />;
  }

  return (
    <>
      <h1>Game</h1>
      <h2>Round {rounds.length + 1} of 20</h2>
      <div>
        <RoundSummary state={gameState} />
      </div>
      <button onClick={() => {}}>Enter bids</button>
    </>
  );
}
