interface PlayerScores {
  playerName: string,
  playerId: string,
  strokes: number[], // TODO: change to throws
  obs: number[],
  total: number,
  toPar: number,
}
