import { calculateToPar, calculateTotalScore } from '../../utils/ScoreUtil'

const playerScoresToPlayer = (playerScores: ApiPlayerScores): Player => {
  return {
    id: playerScores.player_id,
    firstName: playerScores.player_name,
    lastName: playerScores.player_last_name,
    friendStatus: playerScores.friend_status,
    guest: undefined,
    admin: undefined,
  }
}

export const apiGameResponseToGame = (gameResponse: ApiGameResponse): Game => {
  const layoutTotalPar = gameResponse.layout.holes.map((hole: Hole) => hole.par).reduce((a: number, b: number) => a + b)
  return {
    id: gameResponse.game.id,
    creatorId: gameResponse.game.creator_id,
    courseName: gameResponse.course.name,
    layout: { ...gameResponse.layout, total: layoutTotalPar},
    startDate: new Date(gameResponse.game.start_date),
    endDate: new Date(gameResponse.game.end_date),
    temperature: gameResponse.game.temperature,
    comment: gameResponse.game.comment ?? '',
    scores: gameResponse.scores.map((playerScores: ApiPlayerScores) => {
      const total = calculateTotalScore(playerScores.throws, playerScores.obs)
      return {
        player: playerScoresToPlayer(playerScores),
        strokes: playerScores.throws,
        obs: playerScores.obs,
        total: total,
        toPar: calculateToPar(playerScores.throws, total, gameResponse.layout.holes),
      }
    }),
    tags: gameResponse.game.tags.filter(tag => (!tag.condition && !tag.weather_condition)),
    weatherConditions: gameResponse.game.tags.filter(tag => tag.weather_condition),
    conditions: gameResponse.game.tags.filter(tag => tag.condition),
    highScorers: gameResponse.scores.filter(s => s.high_score).map(s => playerScoresToPlayer(s)),
    illegalScorers: gameResponse.scores.filter(s => !s.legal).map(s => playerScoresToPlayer(s)),
  }
}

export const gameToApiGame = (game: Game): ApiGame => {
  return {
    id: game.id,
    creator_id: game.creatorId,
    start_date: game.startDate,
    end_date: game.endDate,
    comment: game.comment,
    temperature: game.temperature,
    tags: game.tags.concat(game.conditions).concat(game.weatherConditions),
  }
}

export const apiPlayerToPlayer = (apiPlayer: ApiPlayer): Player => {
  return {
    id: apiPlayer.id,
    firstName: apiPlayer.first_name,
    lastName: apiPlayer.last_name,
    friendStatus: undefined,
    admin: apiPlayer.admin,
    guest: apiPlayer.guest,
  }
}

export const apiCourseHighScoresToCourseHighScores = (highScores: ApiCourseHighScores): CourseHighScores => {
  return {
    courseName: highScores.course_name,
    layoutHighScores: highScores.layout_high_scores.map(hs => {
      return {
        gameId: hs.game_id,
        gameStartDate: new Date(hs.game_start_date),
        layoutName: hs.layout_name,
        toPar: hs.to_par,
      }
    })
  }
}