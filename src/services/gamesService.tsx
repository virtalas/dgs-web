import axios from 'axios'

import { API_ROOT } from '../apiConfig'
import { apiGameResponseToGame, gameToApiGame } from '../types/api/ModelMappers'

// frontend: January = 0, backend: January = 1

const getGames = async (year: number, month: number): Promise<Game[]> => {
  const response = await axios.get(`${API_ROOT}/games`, {
    params: {
      year: year,
      month: month + 1,
    },
  })
  return response.data.map((gameResponse: ApiGameResponse) => apiGameResponseToGame(gameResponse))
}

const getGame = async (id: string): Promise<Game> => {
  const response = await axios.get(`${API_ROOT}/games/${id}/game`)
  return apiGameResponseToGame(response.data)
}

const getMonthsThatHaveGames = async (): Promise<GameMonths[]> => {  
  const response = await axios.get(`${API_ROOT}/games/months`)
  return response.data.map((gameMonth: GameMonths) => {
    gameMonth.months = gameMonth.months.map(month => month - 1)
    return gameMonth
  })
}

const createGame = async (layout: Layout, players: Player[], start_date: string): Promise<{ id: string }> => {
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
}

const updateGame = async (game: Game): Promise<Game> => {
  const response = await axios.put(`${API_ROOT}/games`, {
    game: gameToApiGame(game),
    scores: game.scores.map((playerScores: PlayerScores) => {
      const legal = game.illegalScorers.find(player => player.id === playerScores.player.id) ? true : false
      return {
        player_id: playerScores.player.id,
        throws: playerScores.strokes,
        obs: playerScores.obs,
        legal: legal,
      }
    }),
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.data
}

const getAvailableConditions = async (): Promise<Tag[]> => {
  const response = await axios.get(`${API_ROOT}/games/tags/conditions`)
  return response.data
}

const getTags = async (): Promise<Tag[]> => {
  const response = await axios.get(`${API_ROOT}/games/tags`)
  return response.data
}

export default {
  getGames,
  getMonthsThatHaveGames,
  createGame,
  getGame,
  updateGame,
  getTags,
  getAvailableConditions,
}
