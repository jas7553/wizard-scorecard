import { Table } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "..";

export default function RoundSummary() {
  const dealerId = useSelector((state: RootState) => state.players.dealerId);
  const players = useSelector((state: RootState) => state.players.players);
  const rounds = useSelector((state: RootState) => state.scorecard.rounds);

  return (
    <Table.Root size={"sm"} mb={"4"}>
      <Table.Body>
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
            <Table.Row key={player.id}>
              <Table.Cell key={`${player.id}-name`}>{playerName}</Table.Cell>
              <Table.Cell key={`${player.id}-score`}>{playerScore}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
