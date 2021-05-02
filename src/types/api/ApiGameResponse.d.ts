interface ApiCourse {
    id: string,
    name: string,
    city: string,
}

interface ApiPlayerScores {
    player_name: string,
    player_last_name: string,
    player_id: string,
    throws: number[],
    obs: number[],
    legal: bool,
    high_score: bool,
}

interface ApiGame {
    id: string,
    creator_id: string,
    start_date: datetime | undefined,
    end_date: datetime,
    comment: string | undefined,
    temperature: double | undefined,
    tags: Tag[],
}

interface ApiGameResponse {
    game: ApiGame,
    course: ApiCourse,
    layout: Layout,
    scores: ApiPlayerScores[],
}
