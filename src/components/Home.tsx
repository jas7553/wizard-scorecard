import { Button, Container, Heading, VStack } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { RootState } from "..";

export default function Home() {
  const isGameInProgress =
    useSelector((state: RootState) => state.players.dealerId) !== null;
  return (
    <>
      <Container maxW="container-xl">
        <Heading size="3xl" textAlign={"center"} paddingY={4}>
          Jason&apos;s app for scoring Wizard
        </Heading>
        <VStack>
          {isGameInProgress ? (
            <Button w="lg" bg={"gray.900"} asChild>
              <Link to="/game">Resume Game</Link>
            </Button>
          ) : null}
          <Button w="lg" bg={"gray.900"} asChild>
            <Link to="/game/new">New Game</Link>
          </Button>
          <Button w="lg" bg={"gray.900"} asChild>
            <Link to="/rules">Rules</Link>
          </Button>
        </VStack>
      </Container>
    </>
  );
}
