import React, { ChangeEvent, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { Player } from "../types";
import { LocalStorageKeys } from "../storage";

function createPlayer(name: string): Player {
  return {
    name,
    id: uuidv4(),
  };
}

enum GameValidity {
  Valid,
  NeedsDealer,
  TooFewPlayers,
  TooManyPlayers,
}

const playerCountMinimum = 3;
const playerCountMaximum = 6;

export default function NewGame() {
  const player1 = createPlayer("player 1");
  const player2 = createPlayer("player 2");
  const [players, setPlayers] = useState<Record<string, Player>>({
    [player1.id]: player1,
    [player2.id]: player2,
  });
  const [playerNameInput, setPlayerNameInput] = useState<string>("");
  const [dealerId, setDealerId] = useState<string>(
    Object.entries(players)[0][1].id,
  );
  const playerNameInputRef = useRef(null);
  const navigate = useNavigate();

  const savePlayer = () => {
    if (!playerNameInput) {
      return;
    }

    const newPlayer = createPlayer(playerNameInput);
    if (Object.keys(players).length === 0) {
      setDealerId(newPlayer.id);
    }
    setPlayers({ ...players, [newPlayer.id]: newPlayer });
    setPlayerNameInput("");
    playerNameInputRef.current?.focus();
  };

  function removePlayer(playerId: string): void {
    setPlayers({ playerId: undefined, ...players });
    if (dealerId === playerId) {
      setDealerId(null);
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
          <button onClick={() => removePlayer(player.id)}>Remove</button>
          <input
            type="checkbox"
            id={`dealer-checkbox-${player.id}`}
            checked={dealerId === player.id}
            onChange={() => setDealerId(player.id)}
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

            navigate("/game");
          }}
        >
          Start game
        </button>
      </p>
    </>
  );
}
