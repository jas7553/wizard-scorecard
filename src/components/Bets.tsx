import React from "react";
import { Player } from "../types";
import Bet from "./Bet";
import { Box, Grid, HStack } from "@chakra-ui/react";

export default function Bets(props: {
  dealerId: string;
  players: Record<string, Player>;
  maxBets: number;
  bets: Record<string, number>;
  setBets(bets: Record<string, number>): void;
}) {
  return (
    <HStack alignItems={"flex-start"} mb={"4"}>
      <Box flex={"1"}>
        <Grid templateColumns="auto 1fr" gap={"2"}>
          {Object.values(props.players).map((player) => (
            <Bet
              key={`${player.id}-bet`}
              player={player}
              maxBet={props.maxBets}
              isDealer={player.id === props.dealerId}
              bets={props.bets}
              onChange={(newBet) => {
                props.setBets({
                  ...props.bets,
                  [player.id]: newBet,
                });
              }}
            />
          ))}
        </Grid>
      </Box>
    </HStack>
  );
}
