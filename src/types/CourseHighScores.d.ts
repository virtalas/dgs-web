interface LayoutHighScore {
  layoutName: string,
  toPar: number,
  gameId: string,
  gameStartDate: Date,
}

interface CourseHighScores {
  courseName: string,
  layoutHighScores: LayoutHighScore[]
}
