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
    <div key={`${props.player.id}-p`}>
      {`${props.player.name}${props.isDealer ? " (dealer)" : ""}`}
      {Array.from({ length: props.maxBet + 1 }, (_, index) => {
        return (
          <React.Fragment key={`${props.player.id}-${index}`}>
            <input
              key={`${props.player.id}-input-${index}`}
              id={`${props.player.id}-input-${index}`}
              type="radio"
              checked={index === props.bets[props.player.id]}
              name={`group-${props.player.id}`}
              onChange={() => props.onChange(index)}
            />
            <label
              key={`${props.player.id}-label-${index}`}
              htmlFor={`${props.player.id}-input-${index}`}
            >
              {index}
            </label>
          </React.Fragment>
        );
      })}
    </div>
  );
}
