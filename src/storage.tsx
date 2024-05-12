import { Player } from "./types";

export enum LocalStorageKeys {
  dealerId = "dealerId",
  mode = "mode",
  players = "players",
  rounds = "rounds",
}

export function getFromStorage<T>(itemKey: LocalStorageKeys): T | null {
  const item = localStorage.getItem(itemKey);
  if (!item) {
    return null;
  }

  return JSON.parse(item);
}

export function getPlayersFromStorage(): Record<string, Player> | null {
  const players = getFromStorage<Record<string, Player>>(
    LocalStorageKeys.players,
  );

  if (!players) {
    return null;
  }

  return Object.fromEntries(
    Object.values(players).map((player) => {
      return [player.id, { ...player, score: 0 }];
    }),
  );
}
