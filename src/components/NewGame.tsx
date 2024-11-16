import React, { ChangeEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { AppDispatch, RootState } from "..";
import { LuUsers } from "react-icons/lu";

import {
  addPlayer,
  removeDealer,
  removePlayer,
  setDealerId,
} from "../features/players";
import { LuCrown } from "react-icons/lu";

import { freshScorecard } from "../features/scorecard";
import { LocalStorageKeys } from "../storage";
import { Player } from "../types";
import {
  Button,
  Text,
  Heading,
  HStack,
  Input,
  VStack,
  Container,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { Checkbox } from "./ui/checkbox";
import { Alert } from "./ui/alert";
import { LuUserPlus, LuTrash } from "react-icons/lu";

const createPlayer = (name: string): Player => ({
  name,
  id: uuidv4(),
});

enum GameValidity {
  Valid,
  NeedsDealer,
  TooFewPlayers,
  TooManyPlayers,
}

const playerCountMinimum = 3;
const playerCountMaximum = 6;

export default function NewGame() {
  const [playerNameInput, setPlayerNameInput] = useState<string>("");
  const playerNameInputRef = useRef(null);
  const navigate = useNavigate();

  const dealerId = useSelector((state: RootState) => state.players.dealerId);
  const players = useSelector((state: RootState) => state.players.players);

  const dispatch = useDispatch<AppDispatch>();

  const savePlayer = () => {
    if (!playerNameInput) {
      return;
    }

    dispatch(addPlayer(createPlayer(playerNameInput)));
    setPlayerNameInput("");
    playerNameInputRef.current?.focus();
  };

  function removePlayerFromGame(playerId: string): void {
    dispatch(removePlayer(playerId));

    if (dealerId === playerId) {
      dispatch(removeDealer());
    }
  }

  function canAddMorePlayers(): boolean {
    return Object.keys(players).length < playerCountMaximum;
  }

  function gameSetupState(): GameValidity {
    if (!dealerId) {
      return GameValidity.NeedsDealer;
    }

    if (Object.keys(players).length < playerCountMinimum) {
      return GameValidity.TooFewPlayers;
    }

    if (Object.keys(players).length > playerCountMaximum) {
      return GameValidity.TooManyPlayers;
    }

    return GameValidity.Valid;
  }

  const gameValidity = gameSetupState();

  return (
    <>
      <Container maxW={"3xl"}>
        <VStack w={"full"} alignItems={"stretch"}>
          <Heading size={"3xl"} textAlign={"center"}>
            Start a new game
          </Heading>
          <Heading size={"xl"}>Players</Heading>
          <HStack>
            <Input
              disabled={!canAddMorePlayers()}
              autoFocus
              required
              minLength={1}
              maxLength={64}
              placeholder={"Add a new player"}
              ref={playerNameInputRef}
              value={playerNameInput}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                setPlayerNameInput(e.target.value)
              }
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  savePlayer();
                }
              }}
            />
            <IconButton disabled={!canAddMorePlayers()} onClick={savePlayer}>
              <LuUserPlus />
            </IconButton>
          </HStack>
          {Object.keys(players).length === playerCountMaximum ? (
            <Alert
              title={
                "You can only have up to " + playerCountMaximum + " players."
              }
              status="warning"
              icon={<LuUsers />}
            ></Alert>
          ) : null}
          <VStack divideY={"2px"} my={"4"}>
            {Object.entries(players).map(([playerId, player]) => (
              <HStack
                key={playerId}
                justify={"space-between"}
                w="full"
                pt={"2"}
              >
                <Box>
                  <Checkbox
                    size="lg"
                    id={`dealer-checkbox-${player.id}`}
                    checked={dealerId === player.id}
                    onCheckedChange={() => dispatch(setDealerId(player.id))}
                    icon={<LuCrown />}
                  >
                    Dealer{dealerId === playerId ? null : "?"}
                  </Checkbox>
                  <Text>{player.name}</Text>
                </Box>
                <IconButton onClick={() => removePlayerFromGame(player.id)}>
                  <LuTrash />
                </IconButton>
              </HStack>
            ))}
          </VStack>
          {gameValidity === GameValidity.NeedsDealer ? (
            <Alert title="Need a dealer" status="error" icon={<LuCrown />} />
          ) : null}
          {gameValidity === GameValidity.TooFewPlayers ? (
            <Alert title="Too Few Players" status="error" icon={<LuUsers />}>
              You need at least {playerCountMinimum} players.
            </Alert>
          ) : null}
          <Box>
            <Button
              width={"full"}
              disabled={gameValidity !== GameValidity.Valid}
              onClick={() => {
                localStorage.setItem(
                  LocalStorageKeys.dealerId,
                  JSON.stringify(dealerId),
                );
                localStorage.setItem(
                  LocalStorageKeys.players,
                  JSON.stringify(players),
                );
                localStorage.removeItem(LocalStorageKeys.mode);
                localStorage.removeItem(LocalStorageKeys.rounds);

                dispatch(freshScorecard(players));

                navigate("/game");
              }}
            >
              Start game
            </Button>
          </Box>
        </VStack>
      </Container>
    </>
  );
}
