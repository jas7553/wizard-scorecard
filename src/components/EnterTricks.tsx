import React, { useState } from "react";

import { Player, Round } from "../types";
import Bets from "./Bets";
import ScoreSheet from "./ScoreSheet";

export default function EnteringTricks(props: {
  dealerId: string;
  players: Record<string, Player>;
  rounds: Array<Round>;
  onBack(): void;
  onConfirmTricks(tricks: Record<string, number>): void;
}) {
  const [tricks, setTricks] = useState(
    Object.fromEntries(
      Object.values(props.players).map((player) => [player.id, 0]),
    ),
  );

  return (
    <>
      <header>
        <h1>Enter tricks</h1>
        <h2>Round {props.rounds.length} of 20</h2>
      </header>
      <Bets
        dealerId={props.dealerId}
        players={props.players}
        maxBets={props.rounds.length}
        bets={tricks}
        setBets={setTricks}
      />
      <div>
        <button onClick={props.onBack}>Back</button>
        <button
          disabled={
            props.rounds.length !==
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
      <ScoreSheet
        players={Object.values(props.players)}
        rounds={props.rounds}
      />
    </>
  );
}
