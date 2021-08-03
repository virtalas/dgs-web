import { CancelTokenSource } from 'axios'

import { apiGameResponseToGame, gameToApiGameUpdate, apiTagToTag, sortTags } from '../types/api/ModelMappers'
import baseService from './baseService'

// frontend: January = 0, backend: January = 1

const getGames = async (year: number, month: number | undefined, searchConditions: GameSearchConditions | undefined, source: CancelTokenSource): Promise<Game[]> => {
  const params = createSearchParameters(year, month, searchConditions)
  const response = await baseService.get('/games', source, params)
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

const getYearsThatHaveGames = async (searchConditions: GameSearchConditions, source: CancelTokenSource): Promise<number[]> => {  
  const params = createSearchParameters(undefined, undefined, searchConditions)
  const response = await baseService.get('/games/years', source, params)
  return response.data
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

const updateGame = async (game: Game, userId: string | undefined, source: CancelTokenSource, newLayout?: Layout): Promise<Game> => {
  if (userId === undefined) {
    return Promise.reject()
  }

  const response = await baseService.put('/games', source, {
    game: gameToApiGameUpdate(game, userId),
    scores: game.scores.map((playerScores: PlayerScores) => {
      const legal = game.illegalScorers.find(player => player.id === playerScores.player.id) ? false : true
      return {
        player_id: playerScores.player.id,
        throws: playerScores.strokes,
        obs: playerScores.obs,
        legal: legal,
      }
    }),
    new_layout_id: newLayout?.id,
  })

  return apiGameResponseToGame(response.data)
}

const changeGameLayout = async (game: Game, layout: Layout, source: CancelTokenSource): Promise<Game> => {
  const response = await baseService.put('/games/layout', source, {
    game_id: game.id,
    layout_id: layout.id,
  })
  return apiGameResponseToGame(response.data)
}


const deleteGame = async (game: Game, source: CancelTokenSource): Promise<{}> => {
  const response = await baseService.delete_('/games', source, {
    id: game.id,
  })
  return response.data
}

const getAvailableConditions = async (source: CancelTokenSource): Promise<Tag[]> => {
  const response = await baseService.get('/games/tags/conditions', source)
  return sortTags(response.data.map((apiTag: ApiTag) => apiTagToTag(apiTag)))
}

const getUserTags = async (source: CancelTokenSource): Promise<Tag[]> => {
  const response = await baseService.get('/games/tags', source)
  return sortTags(response.data
    .filter((tag: ApiTag) => !tag.condition && !tag.weather_condition)
    .map((tag: ApiTag) => apiTagToTag(tag)))
}

const getAllTags = async (source: CancelTokenSource): Promise<Tag[]> => {
  const response = await baseService.get('/games/tags', source)
  return sortTags(response.data
    .map((tag: ApiTag) => apiTagToTag(tag)))
}

export default {
  getGames,
  getMonthsThatHaveGames,
  getYearsThatHaveGames,
  createGame,
  getGame,
  updateGame,
  getUserTags,
  getAllTags,
  getAvailableConditions,
  deleteGame,
  changeGameLayout,
}

function createSearchParameters(year?: number, month?: number, searchParams?: GameSearchConditions): any {
  let params: any = {}

  if (year !== undefined) {
    params.year = year
  }

  if (month !== undefined) {
    params.month = month + 1
  }

  if (searchParams) {
    if (searchParams.course) {
      params.course_id = searchParams.course.id
    }
    if (searchParams.players) {
      params.players = searchParams.players.map(player => player.id)
    }
    if (searchParams.tags) {
      params.tags = searchParams.tags.map(tag => tag.id)
    }
    if (searchParams.comment) {
      params.comment = searchParams.comment
    }
  }

  return params
}
