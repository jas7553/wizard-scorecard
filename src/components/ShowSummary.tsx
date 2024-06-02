import { current } from "@reduxjs/toolkit";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState } from "..";
import { Mode } from "./Game";
import RoundSummary from "./RoundSummary";
import ScoreSheet from "./ScoreSheet";
import { maxNumberOfRounds } from "../constants";

export default function ShowSummary(props: {
  mode: Mode;
  onBack(): void;
  onNext(): void;
}) {
  const players = useSelector((state: RootState) => state.players.players);
  const rounds = useSelector((state: RootState) => state.scorecard.rounds);

  const isGameOver =
    rounds.length === maxNumberOfRounds &&
    Object.values(rounds[rounds.length - 1]).some((cell) => cell.score);

  const isBackButtonShown =
    rounds.length !== 1 || props.mode !== Mode.ShowSummary;

  const determineWinner = () => {
    return Object.values(players)
      .map((player) => {
        return {
          player: player,
          score: rounds
            .flatMap((round) =>
              Object.values(round)
                .filter((cell) => player.id === cell.player.id)
                .map((cell) => cell.score ?? 0),
            )
            .reduce((acc, curr) => acc + curr),
        };
      })
      .reduce((winner, player) =>
        player.score > winner.score ? player : winner,
      ).player.name;
  };

  return (
    <>
      <header>
        <h1>Summary</h1>
        <h2>
          Round {rounds.length} of {maxNumberOfRounds}
        </h2>
      </header>
      <RoundSummary />
      {isGameOver ? null : (
        <>
          {isBackButtonShown ? (
            <button onClick={props.onBack}>Back</button>
          ) : null}
          <button onClick={props.onNext}>
            Enter {props.mode === Mode.ShowSummary ? "bets" : "tricks"}
          </button>
        </>
      )}
      {isGameOver ? (
        <>
          <p>Winner: {determineWinner()}</p>
          <Link to="/game/new">New Game</Link>
        </>
      ) : null}
      <hr />
      <ScoreSheet />
    </>
  );
}
