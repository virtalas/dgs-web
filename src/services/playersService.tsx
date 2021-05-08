import { CancelTokenSource } from 'axios'

import baseService from './baseService'
import { apiPlayerToPlayer, apiCourseHighScoresToCourseHighScores } from '../types/api/ModelMappers'

const getPlayers = async (source: CancelTokenSource): Promise<Player[]> => {
  // TODO: getFriends(user) ?
  const response = await baseService.get('/users', source)
  return response.data.map((apiPlayer: ApiPlayer) => apiPlayerToPlayer(apiPlayer))
}

const playerNameAvailable = async (name: String): Promise<boolean> => {
  // TODO
  // Backend checks that there is no player (guest or normal) with 'name'. Or check just guests common among friends?
  // Note: Trim trailing whitespace.
  return name !== 'test'
}

const getHighScores = async (playerId: string, source: CancelTokenSource): Promise<CourseHighScores[]> => {
  const response = await baseService.get('/users/highscores', source, {
    player_id: playerId,
  })

  const highScores = response.data.map((apiCourseHighScores: ApiCourseHighScores) => apiCourseHighScoresToCourseHighScores(apiCourseHighScores))
  return highScores.sort((a: CourseHighScores, b: CourseHighScores) => {
    if (a.courseName < b.courseName) {
      return -1
    }
    if (a.courseName > b.courseName) {
      return 1
    }
    return 0
  })
}

export default {
  getPlayers,
  playerNameAvailable,
  getHighScores,
}
