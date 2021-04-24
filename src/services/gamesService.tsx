import axios from 'axios'

import { API_ROOT } from '../apiConfig'
import { calculateToPar, calculateTotalScore } from '../utils/ScoreUtil'

const getGames = async (year: number, month: number): Promise<Game[]> => {
  try {
    const response = await axios.get(`${API_ROOT}/games`, {
      params: {
        year: year,
        month: month + 1, // frontend: January = 0, backend: January = 1
      },
    })

    const games = response.data.map((gameResponse: ApiGameResponse) => {
      const layoutTotalPar = gameResponse.layout.holes.map((hole: Hole) => hole.par).reduce((a: number, b: number) => a + b)
      return {
        id: gameResponse.game.id,
        creatorId: gameResponse.game.creator_id,
        courseName: gameResponse.course.name,
        layout: { ...gameResponse.layout, total: layoutTotalPar},
        startDate: new Date(gameResponse.game.start_date),
        endDate: new Date(gameResponse.game.end_date),
        temperature: gameResponse.game.temperature,
        comment: gameResponse.game.comment,
        scores: gameResponse.scores.map((playerScores: ApiPlayerScores) => {
          const total = calculateTotalScore(playerScores.throws, playerScores.obs)
          return {
            playerName: playerScores.player_name,
            playerId: playerScores.player_id,
            strokes: playerScores.throws,
            obs: playerScores.obs,
            total: total,
            toPar: calculateToPar(playerScores.throws, total, gameResponse.layout.holes),
          }
        }),
        tags: gameResponse.game.tags,
        weatherConditions: gameResponse.game.tags.filter(tag => tag.weather_condition),
        conditions: gameResponse.game.tags.filter(tag => tag.condition),
        highScorers: gameResponse.scores.filter(scores => scores.high_score).map(scores => scores.player_name),
        illegalScorers: gameResponse.scores.filter(scores => scores.legal).map(scores => scores.player_name),
      }
    })

    return games
  } catch (e) {
    console.log(e.response.data)
    return Promise.reject()
  }
}

const getMonthsThatHaveGames = async (): Promise<GameMonths[]> => {  
  // January = 0, but comes from backend as January = 1

  try {
    const response = await axios.get(`${API_ROOT}/games/months`)
    return response.data.map((gameMonth: GameMonths) => {
      gameMonth.months = gameMonth.months.map(month => month - 1)
      return gameMonth
    })
  } catch (e) {
    console.log(e.response.data)
    return Promise.reject()
  }
}

const createGame = async (layout: Layout, players: Player[], start_date: string): Promise<{ id: string }> => {
  try {
    const response = await axios.post(`${API_ROOT}/games`, {
      layout_id: layout.id,
      start_date: start_date,
      end_date: start_date, // Initial value.
      comment: '',
      temperature: null,
      player_ids: players.map(player => player.id),
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.data
  } catch (e) {
    console.log(e.response.data)
    return Promise.reject()
  }
}

const getGame = async (id: string): Promise<Game> => {
  // TODO: Replace mock data with API call.
  return Promise.reject()
}

const updateGame = async (game: Game): Promise<Game> => {
  try {
    const response = await axios.put(`${API_ROOT}/games`, {
      game: game,
      scores: [],
      // TODO
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.data
  } catch (e) {
    console.log(e.response.data)
    return Promise.reject()
  }
}

const getAvailableWeatherConditions = async (): Promise<Condition[]> => {
  return ['rain', 'wet (no rain)', 'windy', 'dark', 'snow']
}

const getAvailableConditions = async (): Promise<Condition[]> => {
  return ['LED', 'variant layout', 'doubles']
}

export default {
  getGames,
  getMonthsThatHaveGames,
  createGame,
  getGame,
  updateGame,
  getAvailableWeatherConditions,
  getAvailableConditions,
}
