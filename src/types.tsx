export type Player = {
  name: string;
  id: string;
};

export type Round = Record<string, Cell>;

export type Cell = {
  player: Player;
  bet?: number;
  got?: number;
  score?: number;
};

export type Bets = Record<string, number>;
