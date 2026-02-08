import { Button, Container, Heading, HStack } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState } from "..";
import { getMaxRounds } from "../constants";
import { Mode } from "./Game";
import RoundSummary from "./RoundSummary";
import ScoreSheet from "./ScoreSheet";
import { Alert } from "./ui/alert";

export default function ShowSummary(props: {
  mode: Mode;
  onBack(): void;
  onNext(): void;
}) {
  const players = useSelector((state: RootState) => state.players.players);
  const rounds = useSelector((state: RootState) => state.scorecard.rounds);

  const isGameOver =
    rounds.length === getMaxRounds(Object.keys(players).length) &&
    Object.values(rounds[rounds.length - 1]).some((cell) => cell.score);

  const isBackButtonShown =
    rounds.length !== 1 || props.mode !== Mode.ShowSummary;

  const determineWinner = () => {
    return Object.values(players)
      .map((player) => {
        return {
          player: player,
          score: rounds
            .flatMap((round) =>
              Object.values(round)
                .filter((cell) => player.id === cell.player.id)
                .map((cell) => cell.score ?? 0),
            )
            .reduce((acc, curr) => acc + curr),
        };
      })
      .reduce((winner, player) =>
        player.score > winner.score ? player : winner,
      ).player.name;
  };

  return (
    <Container maxW={"3xl"}>
      <header>
        <Heading size="3xl" textAlign={"center"}>
          Summary
        </Heading>
        <Heading size="xl" textAlign={"center"}>
          Round {rounds.length} of {getMaxRounds(Object.keys(players).length)}
        </Heading>
      </header>
      <RoundSummary />
      {isGameOver ? null : (
        <HStack alignItems={"stretch"} gap={"4"} mb={"4"}>
          {isBackButtonShown ? (
            <Button
              flex={"0.4"}
              size={"sm"}
              variant={"outline"}
              onClick={props.onBack}
            >
              Back
            </Button>
          ) : null}
          <Button flex={"1"} onClick={props.onNext}>
            Enter {props.mode === Mode.ShowSummary ? "bets" : "tricks"}
          </Button>
        </HStack>
      )}
      {isGameOver ? (
        <>
          <Alert
            status="success"
            title={"Winner: " + determineWinner() + ""}
            mb={"4"}
          />
          <HStack alignItems={"stretch"} gap={"4"} mb={"4"}>
            {isBackButtonShown ? (
              <Button flex={"1"}>
                <Link to="/game/new">New Game</Link>
              </Button>
            ) : null}
          </HStack>
        </>
      ) : null}
      <hr />
      <ScoreSheet />
    </Container>
  );
}
