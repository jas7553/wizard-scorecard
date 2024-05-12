import React, { useState } from "react";

import { Player, Round } from "../types";
import Bets from "./Bets";
import ScoreSheet from "./ScoreSheet";

export default function EnterBets(props: {
  dealerId: string;
  players: Record<string, Player>;
  rounds: Array<Round>;
  onBack(): void;
  onConfirmBets(bets: Record<string, number>): void;
}) {
  const [bets, setBets] = useState(
    Object.fromEntries(
      Object.values(props.players).map((player) => [player.id, 0]),
    ),
  );

  return (
    <>
      <header>
        <h1>Enter bets</h1>
        <h2>Round {props.rounds.length} of 20</h2>
      </header>
      <Bets
        dealerId={props.dealerId}
        players={props.players}
        maxBets={props.rounds.length}
        bets={bets}
        setBets={setBets}
      />
      <div>
        <button onClick={props.onBack}>Back</button>
        <button onClick={() => props.onConfirmBets(bets)}>Confirm Bets</button>
      </div>
      <hr />
      <ScoreSheet
        players={Object.values(props.players)}
        rounds={props.rounds}
      />
    </>
  );
}
