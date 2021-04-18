interface Game {
  id: string,
  course: Course,
  startDate: Date | null | undefined,
  endDate: Date,
  scores: PlayerScores[],
  temperature: number | null,
  weatherConditions: Condition[],
  conditions: Condition[],
  highScorers: string[],  // TODO: just get this from filter(PlayerScores.high_score)
  illegalScorers: string[], // TODO: just get this from filter(PlayerScores.legal)
  comment: string,
  contestName: string | null, // TODO: remove
}
