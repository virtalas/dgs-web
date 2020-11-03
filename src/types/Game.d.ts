interface Game {
  id: string,
  course: Course,
  startDate: Date | null | undefined,
  endDate: Date,
  scores: PlayerScores[],
  temperature: number | null,
  weatherConditions: Condition[],
  conditions: Condition[],
  highScorers: string[],
  illegalScorers: string[],
  comment: string,
  contestName: string | null,
}
