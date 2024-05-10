import React, { ChangeEvent, useRef } from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import { NewGameState, Player } from "../types";

function createPlayer(name: string): Player {
  return {
    name: name,
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
  const [players, setPlayers] = useState<Array<Player>>([
    createPlayer("one"),
    createPlayer("two"),
  ]);
  const [playerNameInput, setPlayerNameInput] = useState<string>("");
  const [dealerId, setDealerId] = useState<string>(players[0].id);
  const playerNameInputRef = useRef(null);
  const navigate = useNavigate();

  const savePlayer = () => {
    if (!playerNameInput) {
      return;
    }

    const newPlayer = createPlayer(playerNameInput);
    if (players.length === 0) {
      setDealerId(newPlayer.id);
    }
    setPlayers(players.concat(newPlayer));
    setPlayerNameInput("");
    playerNameInputRef.current?.focus();
  };

  function removePlayer(playerId: string): void {
    setPlayers(players.filter((player) => player.id !== playerId));
    if (dealerId === playerId) {
      setDealerId(null);
    }
  }

  function canAddMorePlayers(): boolean {
    return players.length < playerCountMaximum;
  }

  function gameSetupState(): GameValidity {
    if (!dealerId) {
      return GameValidity.NeedsDealer;
    }

    if (players.length < playerCountMinimum) {
      return GameValidity.TooFewPlayers;
    }

    if (players.length > playerCountMaximum) {
      return GameValidity.TooManyPlayers;
    }

    return GameValidity.Valid;
  }

  const gameValidity = gameSetupState();

  return (
    <>
      <h1>Starting a new game</h1>
      <h2>Players</h2>
      <h3>Who is joining this game?</h3>
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
      {players.map((player) => (
        <p key={player.id}>
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
            const game: NewGameState = {
              players: players,
              dealerId: dealerId,
            };
            localStorage.setItem("gameState", JSON.stringify(game));
            navigate("/game");
          }}
        >
          Start game
        </button>
      </p>
    </>
  );
}
