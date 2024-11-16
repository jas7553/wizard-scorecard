const roundsByPlayerCount: Record<number, number> = {
  3: 20,
  4: 15,
  5: 12,
};

export function getMaxRounds(playerCount: number): number {
  return roundsByPlayerCount[playerCount];
}
