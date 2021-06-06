interface ApiPlayerScores {
  player_name: string,
  player_last_name: string | undefined,
  friend_status: 'confirmed' | 'pending' | 'not_friends',
  player_id: string,
  throws: number[],
  obs: number[],
  legal: bool,
  high_score: bool,
}

interface ApiComment {
  id: string,
  user_id: string,
  content: string,
  created_date: Date,
}

interface ApiTag {
  id: string | undefined,
  name: string,
  condition: bool,
  weather_condition: bool,
}

interface ApiGame {
  id: string,
  creator_id: string,
  start_date: datetime | undefined,
  end_date: datetime,
  comments: ApiComment[],
  temperature: double | undefined,
  tags: ApiTag[],
}

interface ApiGameResponse {
  game: ApiGame,
  course: ApiCourse,
  layout: GameLayout,
  scores: ApiPlayerScores[],
}
