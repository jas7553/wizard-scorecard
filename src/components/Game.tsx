import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { AppDispatch, RootState } from "..";
import { advanceDealer, unadvanceDealer } from "../features/players";
import {
  addRound,
  confirmBets,
  confirmTricks,
  undoLastBets,
  undoLastRound,
  undoLastTricks,
} from "../features/scorecard";
import { getFromStorage, LocalStorageKeys } from "../storage";
import EnterBets from "./EnterBets";
import EnteringTricks from "./EnterTricks";
import ShowSummary from "./ShowSummary";
import { maxNumberOfRounds } from "../constants";

export enum Mode {
  ShowSummary,
  CollectingBets,
  ShowSummaryBeforeTricks,
  EnteringTricks,
}

export default function Game() {
  const dispatch = useDispatch<AppDispatch>();

  const [mode, setMode] = useState<Mode>(
    getFromStorage(LocalStorageKeys.mode) || Mode.ShowSummary,
  );
  useEffect(
    () => localStorage.setItem(LocalStorageKeys.mode, JSON.stringify(mode)),
    [mode],
  );

  const [previousBets, setPreviousBets] = useState<{
    [k: string]: number;
  }>();

  const [previousTricks, setPreviousTricks] = useState<{
    [k: string]: number;
  }>();

  const dealerId = useSelector((state: RootState) => state.players.dealerId);
  const players = useSelector((state: RootState) => state.players.players);
  const rounds = useSelector((state: RootState) => state.scorecard.rounds);

  if (dealerId === null) {
    return <Navigate replace to={"/game/new"} />;
  }

  if (mode === Mode.ShowSummary) {
    return (
      <ShowSummary
        mode={mode}
        onBack={() => {
          setPreviousTricks(
            Object.fromEntries(
              Object.values(rounds[rounds.length - 2]).map((cell) => [
                cell.player.id,
                cell.got,
              ]),
            ),
          );
          dispatch(unadvanceDealer());
          dispatch(undoLastRound());
          dispatch(undoLastTricks());
          setMode(Mode.EnteringTricks);
        }}
        onNext={() => setMode(Mode.CollectingBets)}
      />
    );
  } else if (mode === Mode.ShowSummaryBeforeTricks) {
    return (
      <ShowSummary
        mode={mode}
        onBack={() => {
          setPreviousBets(
            Object.fromEntries(
              Object.values(rounds[rounds.length - 1]).map((cell) => [
                cell.player.id,
                cell.bet,
              ]),
            ),
          );
          dispatch(undoLastBets());
          setMode(Mode.CollectingBets);
        }}
        onNext={() => setMode(Mode.EnteringTricks)}
      />
    );
  } else if (mode === Mode.CollectingBets) {
    return (
      <EnterBets
        bets={previousBets}
        onBack={() => setMode(Mode.ShowSummary)}
        onConfirmBets={(bets) => {
          dispatch(confirmBets(bets));
          setMode(Mode.ShowSummaryBeforeTricks);
        }}
      />
    );
  } else {
    return (
      <EnteringTricks
        tricks={previousTricks}
        onBack={() => setMode(Mode.ShowSummaryBeforeTricks)}
        onConfirmTricks={(tricks) => {
          dispatch(confirmTricks(tricks));

          if (rounds.length !== maxNumberOfRounds) {
            dispatch(advanceDealer());
            dispatch(addRound(players));
          }

          setMode(Mode.ShowSummary);
        }}
      />
    );
  }
}
