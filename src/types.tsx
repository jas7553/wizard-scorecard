export interface Player {
  name: string;
  id: string;
}

export interface NewGameState {
  players: Array<Player>;
  dealerId: string;
}

export interface GamePlayer extends Player {
  score: number;
}

export interface GameState {
  players: Array<GamePlayer>;
  dealerId: string;
}
