interface ApiPlayerScores {
  player_name: string,
  player_last_name: string | undefined,
  friend_status: 'confirmed' | 'pending' | 'not_friends',
  guest: boolean,
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

interface ApiPhoto {
  id: string,
  key: string,
  url: string | undefined,
  thumbnail_key: string,
  thumbnail_url: string | undefined,
  created_date: Date,
}

interface ApiGame {
  id: string,
  creator_id: string,
  start_date: datetime | undefined,
  end_date: datetime,
  comments: ApiComment[],
  temperature: double | undefined,
  tags: ApiTag[],
  photos: ApiPhoto[],
  allowed_to_edit: boolean,
}

interface ApiGameResponse {
  game: ApiGame,
  course: {
    id: string,
    name: string,
    city: string,
  },
  layout: GameLayout,
  scores: ApiPlayerScores[],
}
