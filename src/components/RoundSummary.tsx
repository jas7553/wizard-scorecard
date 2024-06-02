import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "..";

export default function RoundSummary() {
  const dealerId = useSelector((state: RootState) => state.players.dealerId);
  const players = useSelector((state: RootState) => state.players.players);
  const rounds = useSelector((state: RootState) => state.scorecard.rounds);

  return (
    <table>
      <tbody>
        {Object.values(players).map((player) => {
          const playerName = `${player.name}${player.id === dealerId ? " (dealer)" : ""}`;
          const playerScore = rounds
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
