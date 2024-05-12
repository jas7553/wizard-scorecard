import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { Player, Round } from "../types";
import EnterBets from "./EnterBets";
import EnteringTricks from "./EnterTricks";
import ShowSummary from "./ShowSummary";
import {
  getFromStorage,
  getPlayersFromStorage,
  LocalStorageKeys,
} from "../storage";

export enum Mode {
  ShowSummary,
  CollectingBets,
  ShowSummaryBeforeTricks,
  EnteringTricks,
}

function freshRound(players: Record<string, Player>): Round {
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
}

export default function Game() {
  const [mode, setMode] = useState<Mode>(
    getFromStorage(LocalStorageKeys.mode) || Mode.ShowSummary,
  );
  useEffect(
    () => localStorage.setItem(LocalStorageKeys.mode, JSON.stringify(mode)),
    [mode],
  );

  const [dealerId, setDealerId] = useState<string>(
    getFromStorage(LocalStorageKeys.dealerId),
  );
  useEffect(
    () =>
      localStorage.setItem(LocalStorageKeys.dealerId, JSON.stringify(dealerId)),
    [dealerId],
  );

  const players = getPlayersFromStorage();

  if (!players) {
    return <Navigate replace to={"/game/new"} />;
  }

  const [rounds, setRounds] = useState<Array<Round>>(
    getFromStorage(LocalStorageKeys.rounds) || [freshRound(players)],
  );
  useEffect(
    () => localStorage.setItem("rounds", JSON.stringify(rounds)),
    [rounds],
  );

  if (mode === Mode.ShowSummary) {
    return (
      <ShowSummary
        dealerId={dealerId}
        players={players}
        mode={mode}
        rounds={rounds}
        onNext={() => setMode(Mode.CollectingBets)}
      />
    );
  } else if (mode === Mode.ShowSummaryBeforeTricks) {
    return (
      <ShowSummary
        dealerId={dealerId}
        players={players}
        mode={mode}
        rounds={rounds}
        onNext={() => setMode(Mode.EnteringTricks)}
      />
    );
  } else if (mode === Mode.CollectingBets) {
    return (
      <EnterBets
        dealerId={dealerId}
        players={players}
        rounds={rounds}
        onBack={() => setMode(Mode.ShowSummary)}
        onConfirmBets={(bets) => {
          const previousRounds: Array<Round> = rounds.slice(
            0,
            rounds.length - 1,
          );
          const currentRound: Round = rounds[rounds.length - 1];
          const updatedRound: Round = Object.fromEntries(
            Object.entries(currentRound).map(([playerId, cell]) => {
              const updatedCell = {
                ...cell,
                bet: bets[playerId],
              };
              return [playerId, updatedCell];
            }),
          );
          setRounds([...previousRounds, updatedRound]);
          setMode(Mode.ShowSummaryBeforeTricks);
        }}
      />
    );
  } else {
    return (
      <EnteringTricks
        dealerId={dealerId}
        players={players}
        rounds={rounds}
        onBack={() => setMode(Mode.ShowSummaryBeforeTricks)}
        onConfirmTricks={(tricks) => {
          const previousRounds = rounds.slice(0, rounds.length - 1);
          const updatedRound = Object.fromEntries(
            Object.values(rounds[rounds.length - 1]).map((cell) => {
              const updatedCell = {
                ...cell,
                got: tricks[cell.player.id],
                score:
                  cell.bet === tricks[cell.player.id]
                    ? 20 + tricks[cell.player.id] * 10
                    : -10 * tricks[cell.player.id],
              };
              return [cell.player.id, updatedCell];
            }),
          );

          if (rounds.length === 20) {
            setRounds([...previousRounds, updatedRound]);
            setMode(Mode.ShowSummary);
          } else {
            setRounds([...previousRounds, updatedRound, freshRound(players)]);
            setMode(Mode.ShowSummary);
            const playerIds = Object.keys(players);
            setDealerId(
              playerIds[(playerIds.indexOf(dealerId) + 1) % playerIds.length],
            );
          }
        }}
      />
    );
  }
}
