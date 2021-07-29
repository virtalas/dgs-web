interface Game {
  id: string,
  creatorId: string,
  courseName: string,
  courseId: string,
  layout: GameLayout,
  startDate: Date | undefined,
  endDate: Date,
  temperature: number | undefined,
  comments: GameComment[],
  scores: PlayerScores[],
  tags: Tag[],
  weatherConditions: Tag[],
  conditions: Tag[],
  photos: Photo[],
  highScorers: Player[],
  illegalScorers: Player[],
  allowedToEdit: boolean,
}

interface GameSearchConditions {
  course?: Course,
}
