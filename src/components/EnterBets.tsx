import { Button, Container, Heading, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { LuCircleEqual } from "react-icons/lu";
import { useSelector } from "react-redux";

import { RootState } from "..";
import { getMaxRounds } from "../constants";
import Bets from "./Bets";
import ScoreSheet from "./ScoreSheet";
import { Alert } from "./ui/alert";

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
    <Container maxW={"3xl"}>
      <header>
        <Heading size={"3xl"} textAlign={"center"}>
          Enter bets
        </Heading>
        <Heading size={"xl"} textAlign={"center"}>
          Round {rounds.length} of {getMaxRounds(Object.keys(players).length)}
        </Heading>
      </header>
      <Bets
        dealerId={dealerId}
        players={players}
        maxBets={rounds.length}
        bets={bets}
        setBets={setBets}
      />
      <HStack alignItems={"stretch"} gap={"4"} mb={"4"}>
        <Button
          flex={"0.4"}
          size={"sm"}
          variant={"outline"}
          onClick={props.onBack}
        >
          Back
        </Button>
        <Button
          flex={"1"}
          disabled={betsAreEqualToTheRoundNumber}
          onClick={() => props.onConfirmBets(bets)}
        >
          Confirm bets
        </Button>
      </HStack>
      {betsAreEqualToTheRoundNumber ? (
        <Alert
          mb={"4"}
          title="Bets cannot equal the round number"
          status="warning"
          icon={<LuCircleEqual />}
        />
      ) : null}
      <hr />
      <ScoreSheet />
    </Container>
  );
}
