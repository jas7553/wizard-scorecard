import React, { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "..";
import Bets from "./Bets";
import ScoreSheet from "./ScoreSheet";
import { maxNumberOfRounds } from "../constants";

export default function EnteringTricks(props: {
  tricks?: Record<string, number>;
  onBack(): void;
  onConfirmTricks(tricks: Record<string, number>): void;
}) {
  const dealerId = useSelector((state: RootState) => state.players.dealerId);
  const players = useSelector((state: RootState) => state.players.players);
  const rounds = useSelector((state: RootState) => state.scorecard.rounds);

  const [tricks, setTricks] = useState(
    props.tricks ??
      Object.fromEntries(
        Object.values(players).map((player) => [player.id, 0]),
      ),
  );

  return (
    <>
      <header>
        <h1>Enter tricks</h1>
        <h2>
          Round {rounds.length} of {maxNumberOfRounds}
        </h2>
      </header>
      <Bets
        dealerId={dealerId}
        players={players}
        maxBets={rounds.length}
        bets={tricks}
        setBets={setTricks}
      />
      <div>
        <button onClick={props.onBack}>Back</button>
        <button
          disabled={
            rounds.length !==
            Object.values(tricks).reduce(
              (sum, trickCount) => sum + trickCount,
              0,
            )
          }
          onClick={() => props.onConfirmTricks(tricks)}
        >
          Confirm Tricks
        </button>
      </div>
      <hr />
      <ScoreSheet />
    </>
  );
}
