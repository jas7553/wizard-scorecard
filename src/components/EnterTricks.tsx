import { Button, Container, Heading, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { LuCircleEqual } from "react-icons/lu";
import { useSelector } from "react-redux";

import { RootState } from "..";
import { getMaxRounds } from "../constants";
import Bets from "./Bets";
import ScoreSheet from "./ScoreSheet";
import { Alert } from "./ui/alert";

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

  const totalTrickCount = Object.values(tricks).reduce(
    (sum, trickCount) => sum + trickCount,
    0,
  );

  return (
    <Container maxW={"3xl"}>
      <header>
        <Heading size={"3xl"} textAlign={"center"}>
          Enter tricks
        </Heading>
        <Heading size={"xl"} textAlign={"center"}>
          Round {rounds.length} of {getMaxRounds(Object.keys(players).length)}
        </Heading>
      </header>
      <Bets
        dealerId={dealerId}
        players={players}
        maxBets={rounds.length}
        bets={tricks}
        setBets={setTricks}
      />
      <HStack alignItems={"stretch"} gap={"4"} mb={"4"}>
        <Button flex={"1"} onClick={props.onBack}>
          Back
        </Button>
        <Button
          flex={"1"}
          disabled={rounds.length !== totalTrickCount}
          onClick={() => props.onConfirmTricks(tricks)}
        >
          Confirm Tricks
        </Button>
      </HStack>
      {rounds.length !== totalTrickCount ? (
        <Alert
          mb={"4"}
          title="Number of tricks must equal the round number"
          status="warning"
          icon={<LuCircleEqual />}
        />
      ) : null}
      <hr />
      <ScoreSheet />
    </Container>
  );
}
