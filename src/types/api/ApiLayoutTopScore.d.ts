interface ApiLayoutTopScore {
    game_id: string,
    game_end_date: Date,
    player_id: string,
    player_first_name: string,
    player_last_name: string,
    to_par: number,
    total_score: number,
}

interface ApiLayoutTopScores {
    me_and_friends_top: ApiLayoutTopScore[],
    my_top: ApiLayoutTopScore[],
}
