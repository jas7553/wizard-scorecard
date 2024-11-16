import { Grid, GridItem, Heading, Table } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "..";

export default function ScoreSheet() {
  const players = useSelector((state: RootState) => state.players.players);
  const rounds = useSelector((state: RootState) => state.scorecard.rounds);

  return (
    <>
      <Heading size={"4xl"} mb={"4"}>
        Scorecard
      </Heading>
      <Table.Root variant={"outline"} tableLayout={"fixed"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w={"75px"} />
            {Object.values(players).map((player) => (
              <Table.ColumnHeader key={player.id} w={"100%"}>
                {player.name}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rounds.map((round, roundNumber) => (
            <Table.Row key={roundNumber}>
              <Table.Cell key={roundNumber}>{roundNumber + 1}</Table.Cell>
              {Object.values(players).map((player) => (
                <Table.Cell key={player.id} padding={"2"}>
                  <Grid templateColumns="auto 1fr">
                    <GridItem mr={"2"}>Bet:</GridItem>
                    <GridItem>{round[player.id].bet}</GridItem>
                    <GridItem mr={"2"}>Got:</GridItem>
                    <GridItem>{round[player.id].got}</GridItem>
                    <GridItem mr={"2"}>Score:</GridItem>
                    <GridItem>{round[player.id].score}</GridItem>
                  </Grid>
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
