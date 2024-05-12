import React from "react";
import { Player, Round } from "../types";

export default function ScoreSheet(props: {
  players: Array<Player>;
  rounds: Array<Round>;
}) {
  const tableStyle = { border: "1px solid black" };
  const roundColumnStyle = { ...tableStyle, width: "20px" };
  const tdStyle = { ...tableStyle, width: "100px" };

  return (
    <>
      <h2>Scorecard</h2>
      <table style={{ ...tableStyle, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={roundColumnStyle}></th>
            {props.players.map((player) => (
              <th key={player.id} style={tdStyle}>
                {player.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rounds.map((round, roundNumber) => (
            <tr key={roundNumber}>
              <td key={roundNumber} style={roundColumnStyle}>
                {roundNumber + 1}
              </td>
              {props.players.map((player) => (
                <td key={player.id} style={tdStyle}>
                  <div>Bet: {round[player.id].bet}</div>
                  <div>Got: {round[player.id].got}</div>
                  <div>Score: {round[player.id].score}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
