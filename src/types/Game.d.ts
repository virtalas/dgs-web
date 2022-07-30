interface Game {
  id: string,
  creatorId: string,
  courseName: string,
  courseId: string,
  layout: GameLayout,
  startDate: Date | undefined,
  endDate: Date,
  temperature: number | undefined,
  weatherIconId: string | undefined,
  comments: GameComment[],
  scores: PlayerScores[],
  tags: Tag[],
  weatherConditions: Tag[],
  conditions: Tag[],
  photos: Photo[],
  highScorers: GameHighScore[],
  illegalScorers: Player[],
  allowedToEdit: boolean,
  finished: boolean,
  isEditing?: boolean, // Used by Games.tsx to not filter out games that are currently being edited.
}

interface GameSearchConditions {
  course?: Course,
  players?: Player[],
  tags?: Tag[],
  comment?: string,
}

interface GameHighScore {
  player: Player,
  isCurrentBest: boolean,
}