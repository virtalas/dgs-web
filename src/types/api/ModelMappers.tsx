import { calculateToPar, calculateTotalScore } from '../../utils/ScoreUtil'

const nameAndIdToPlayer = (firstName: string, id: string): Player => {
  return {
    id: id,
    firstName: firstName,
    guest: undefined,
    admin: undefined,
  }
}

export const gameResponseToGame = (gameResponse: ApiGameResponse): Game => {
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
        player: nameAndIdToPlayer(playerScores.player_name, playerScores.player_id),
        strokes: playerScores.throws,
        obs: playerScores.obs,
        total: total,
        toPar: calculateToPar(playerScores.throws, total, gameResponse.layout.holes),
      }
    }),
    tags: gameResponse.game.tags,
    weatherConditions: gameResponse.game.tags.filter(tag => tag.weather_condition),
    conditions: gameResponse.game.tags.filter(tag => tag.condition),
    highScorers: gameResponse.scores.filter(s => s.high_score).map(s => nameAndIdToPlayer(s.player_name, s.player_id)),
    illegalScorers: gameResponse.scores.filter(s => s.legal).map(s => nameAndIdToPlayer(s.player_name, s.player_id)),
  }
}
