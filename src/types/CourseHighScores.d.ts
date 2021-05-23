interface LayoutHighScore {
  layoutName: string,
  toPar: number,
  gameId: string,
  gameEndDate: Date,
}

interface CourseHighScores {
  courseName: string,
  layoutHighScores: LayoutHighScore[]
}
