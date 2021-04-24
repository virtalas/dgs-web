interface Game {
  id: string,
  creatorId: string,
  courseName: string,
  layout: Layout,
  startDate: Date | null | undefined,
  endDate: Date,
  temperature: number | null,
  comment: string,
  scores: PlayerScores[],
  tags: Tag[],
  weatherConditions: Condition[], // TODO: get this from tags
  conditions: Condition[], // TODO: get this from tags
  highScorers: string[],  // TODO: just get this from filter(PlayerScores.high_score)
  illegalScorers: string[], // TODO: just get this from filter(PlayerScores.legal)
}
