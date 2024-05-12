import React from "react";
import { Link } from "react-router-dom";

import { Player, Round } from "../types";
import { Mode } from "./Game";
import RoundSummary from "./RoundSummary";
import ScoreSheet from "./ScoreSheet";

export default function ShowSummary(props: {
  dealerId: string;
  players: Record<string, Player>;
  mode: Mode;
  rounds: Array<Round>;
  onNext(): void;
}) {
  const isGameOver =
    props.rounds.length === 20 &&
    props.rounds.some((round) =>
      Object.values(round).some((cell) => cell.score),
    );
  return (
    <>
      <header>
        <h1>Summary</h1>
        <h2>Round {props.rounds.length} of 20</h2>
      </header>
      <RoundSummary
        rounds={props.rounds}
        dealerId={props.dealerId}
        players={props.players}
      />
      {isGameOver ? null : (
        <button onClick={props.onNext}>
          Enter {props.mode === Mode.ShowSummary ? "bets" : "tricks"}
        </button>
      )}
      {isGameOver ? (
        <>
          <p>winner: foo</p>
          <Link to="/game/new">New Game</Link>
        </>
      ) : null}
      <hr />
      <ScoreSheet
        players={Object.values(props.players)}
        rounds={props.rounds}
      />
    </>
  );
}
