import axios from 'axios'

import { API_ROOT } from '../apiConfig'
import { gameResponseToGame } from '../types/api/ModelMappers'

// frontend: January = 0, backend: January = 1

const getGames = async (year: number, month: number): Promise<Game[]> => {
  try {
    const response = await axios.get(`${API_ROOT}/games`, {
      params: {
        year: year,
        month: month + 1,
      },
    })

    const games = response.data.map((gameResponse: ApiGameResponse) => gameResponseToGame(gameResponse))
    return games
  } catch (e) {
    console.log(e.response.data)
    return Promise.reject()
  }
}

const getMonthsThatHaveGames = async (): Promise<GameMonths[]> => {  
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
      end_date: start_date,
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
      scores: game.scores.map((playerScores: PlayerScores) => {
        // const legal = game.illegalScorers.find()
        return {
          player_id: playerScores.player.id,
          throws: playerScores.strokes,
          obs: playerScores.obs,
          // legal: legal,
        }
      }),
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

const getAvailableWeatherConditions = async (): Promise<Tag[]> => {
  return [{id: '123gjrdöigj', name: 'rain', condition: false, weather_condition: true}]
}

const getAvailableConditions = async (): Promise<Tag[]> => {
  return [{id: 'fjsdlöjgsiejdk', name: 'LED', condition: true, weather_condition: false}]
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
