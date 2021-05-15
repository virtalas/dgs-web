import { CancelTokenSource } from 'axios'

import { apiGameResponseToGame, gameToApiGame } from '../types/api/ModelMappers'
import baseService from './baseService'

// frontend: January = 0, backend: January = 1

const getGames = async (year: number, month: number, source: CancelTokenSource): Promise<Game[]> => {
  const response = await baseService.get('/games', source, {
    year: year,
    month: month + 1,
  })
  return response.data.map((gameResponse: ApiGameResponse) => apiGameResponseToGame(gameResponse))
}

const getGame = async (id: string, source: CancelTokenSource): Promise<Game> => {
  const response = await baseService.get(`/games/${id}/game`, source)
  return apiGameResponseToGame(response.data)
}

const getMonthsThatHaveGames = async (source: CancelTokenSource): Promise<GameMonths[]> => {  
  const response = await baseService.get('/games/months', source)
  return response.data.map((gameMonth: GameMonths) => {
    gameMonth.months = gameMonth.months.map(month => month - 1)
    return gameMonth
  })
}

const createGame = async (layout: Layout, players: Player[], start_date: string, source: CancelTokenSource): Promise<{ id: string }> => {
  const response = await baseService.post('/games', source, {
    layout_id: layout.id,
    start_date: start_date,
    end_date: start_date,
    comment: '',
    temperature: null,
    player_ids: players.filter(player => !player.newGuest).map(player => player.id),
    new_guest_names: players.filter(player => player.newGuest).map(player => player.firstName),
  })
  return response.data
}

const updateGame = async (game: Game, source: CancelTokenSource): Promise<Game> => {
  const response = await baseService.put('/games', source, {
    game: gameToApiGame(game),
    scores: game.scores.map((playerScores: PlayerScores) => {
      const legal = game.illegalScorers.find(player => player.id === playerScores.player.id) ? false : true
      return {
        player_id: playerScores.player.id,
        throws: playerScores.strokes,
        obs: playerScores.obs,
        legal: legal,
      }
    }),
  })

  return apiGameResponseToGame(response.data)
}

const getAvailableConditions = async (source: CancelTokenSource): Promise<Tag[]> => {
  const response = await baseService.get('/games/tags/conditions', source)
  return response.data
}

const getTags = async (source: CancelTokenSource): Promise<Tag[]> => {
  const response = await baseService.get('/games/tags', source)
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
