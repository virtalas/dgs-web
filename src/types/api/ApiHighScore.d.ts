interface ApiLayoutHighScore {
  layout_name: string,
  to_par: number,
  game_id: string,
  game_start_date: Date,
}

interface ApiCourseHighScores {
  course_name: string,
  layout_high_scores: ApiLayoutHighScore[],
}
