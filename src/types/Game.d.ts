interface Game {
  id: number,
  course: Course,
  startDate: string | null,
  endDate: string,
  scores: PlayerScores[],
  temperature: number | null,
  weatherConditions: Condition[],
  conditions: Condition[],
  highScorers: string[],
  illegalScorers: string[],
  comment: string | null,
  contestName: string | null,
}
