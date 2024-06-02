import React, { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "..";
import {
  addPlayer,
  removeDealer,
  removePlayer,
  setDealerId,
} from "../features/players";
import { freshScorecard } from "../features/scorecard";
import { LocalStorageKeys } from "../storage";
import { Player } from "../types";

const createPlayer = (name: string): Player => {
  return {
    name,
    id: uuidv4(),
  };
};

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
      <header>
        <h1>Starting a new game</h1>
        <h2>Players</h2>
      </header>
      <input
        disabled={!canAddMorePlayers()}
        autoFocus
        required
        minLength={1}
        maxLength={64}
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
      <button disabled={!canAddMorePlayers()} onClick={savePlayer}>
        Add player
      </button>
      {Object.entries(players).map(([playerId, player]) => (
        <p key={playerId}>
          {player.name}
          <button onClick={() => removePlayerFromGame(player.id)}>
            Remove
          </button>
          <input
            type="checkbox"
            id={`dealer-checkbox-${player.id}`}
            checked={dealerId === player.id}
            onChange={() => dispatch(setDealerId(player.id))}
          />
          <label htmlFor={`dealer-checkbox-${player.id}`}>Dealer?</label>
        </p>
      ))}
      <h2>Start?</h2>
      {gameValidity === GameValidity.NeedsDealer ? <p>Need a dealer</p> : null}
      {gameValidity === GameValidity.TooFewPlayers ? (
        <p>You need at least {playerCountMinimum} players</p>
      ) : null}
      <p>
        <button
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
        </button>
      </p>
    </>
  );
}
