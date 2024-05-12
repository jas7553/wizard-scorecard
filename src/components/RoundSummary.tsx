import React from "react";

import { Player, Round } from "../types";

export default function RoundSummary(props: {
  dealerId: string;
  players: Record<string, Player>;
  rounds: Array<Round>;
}) {
  return (
    <table>
      <tbody>
        {Object.values(props.players).map((player) => {
          const playerName = `${player.name}${player.id === props.dealerId ? " (dealer)" : ""}`;
          const playerScore = props.rounds
            .map((round) =>
              Object.entries(round).find((entry) => player.id === entry[0]),
            )
            .reduce(
              (total, roundEntry) => total + (roundEntry[1].score || 0),
              0,
            );
          return (
            <tr key={player.id}>
              <td key={`${player.id}-name`}>{playerName}</td>
              <td key={`${player.id}-score`}>{playerScore}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
