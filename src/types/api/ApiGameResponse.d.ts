interface ApiCourse {
  id: string,
  name: string,
  city: string,
}

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

interface ApiGame {
  id: string,
  creator_id: string,
  start_date: datetime | undefined,
  end_date: datetime,
  comments: ApiComment[],
  temperature: double | undefined,
  tags: Tag[],
}

interface ApiGameUpdate {
  id: string,
  creator_id: string,
  start_date: datetime | undefined,
  end_date: datetime,
  comment_content: string,
  temperature: double | undefined,
  tags: Tag[],
}

interface ApiGameResponse {
  game: ApiGame,
  course: ApiCourse,
  layout: Layout,
  scores: ApiPlayerScores[],
}
