import React, { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "..";
import Bets from "./Bets";
import ScoreSheet from "./ScoreSheet";
import { maxNumberOfRounds } from "../constants";

export default function EnterBets(props: {
  bets?: Record<string, number>;
  onBack(): void;
  onConfirmBets(bets: Record<string, number>): void;
}) {
  const dealerId = useSelector((state: RootState) => state.players.dealerId);
  const players = useSelector((state: RootState) => state.players.players);
  const rounds = useSelector((state: RootState) => state.scorecard.rounds);

  const [bets, setBets] = useState(
    props.bets ??
      Object.fromEntries(
        Object.values(players).map((player) => [player.id, 0]),
      ),
  );

  const betsAreEqualToTheRoundNumber =
    Object.values(bets).reduce((sum, betCount) => sum + betCount, 0) ===
    rounds.length;

  return (
    <>
      <header>
        <h1>Enter bets</h1>
        <h2>
          Round {rounds.length} of {maxNumberOfRounds}
        </h2>
      </header>
      <Bets
        dealerId={dealerId}
        players={players}
        maxBets={rounds.length}
        bets={bets}
        setBets={setBets}
      />
      <div>
        <button onClick={props.onBack}>Back</button>
        <button
          disabled={betsAreEqualToTheRoundNumber}
          onClick={() => props.onConfirmBets(bets)}
        >
          Confirm Bets
        </button>
        {betsAreEqualToTheRoundNumber
          ? "(bets cannot equal the round number)"
          : null}
      </div>
      <hr />
      <ScoreSheet />
    </>
  );
}
