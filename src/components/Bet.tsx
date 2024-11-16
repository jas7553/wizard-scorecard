import { Button, GridItem, HStack } from "@chakra-ui/react";
import React, { ReactElement } from "react";

import { Player } from "../types";

export default function Bet(props: {
  player: Player;
  bets: Record<string, number>;
  isDealer: boolean;
  maxBet: number;
  onChange(newBet: number): void;
}): ReactElement {
  return (
    <>
      <GridItem key={`${props.player.id}-1`} alignContent={"center"}>
        {`${props.player.name}${props.isDealer ? " (dealer)" : ""}`}
      </GridItem>
      <GridItem key={`${props.player.id}-2`}>
        <HStack>
          {Array.from({ length: props.maxBet + 1 }, (_, index) => {
            const isSelected = index === props.bets[props.player.id];
            return (
              <Button
                key={`${props.player.id}-${index}`}
                backgroundColor={isSelected ? "gray.900" : "white"}
                borderWidth={"2px"}
                borderColor={isSelected ? "gray.900" : "gray.200"}
                borderStyle={"solid"}
                borderRadius={"50%"}
                color={isSelected ? "white" : "gray.900"}
                cursor={"pointer"}
                transition={"all 0.2s ease"}
                size={"xs"}
                w={"8"}
                h={"8"}
                onClick={() => props.onChange(index)}
                _hover={{
                  backgroundColor: "gray.900",
                  borderColor: "gray.900",
                  color: "white",
                }}
                _after={{
                  backgroundColor: isSelected ? "gray.200" : "gray.900",
                  color: isSelected ? "gray.900" : "white",
                  borderColor: isSelected ? "gray.200" : "gray.900",
                }}
              >
                {index}
              </Button>
            );
          })}
        </HStack>
      </GridItem>
    </>
  );
}
