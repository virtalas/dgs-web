import axios from 'axios'

import { API_ROOT } from '../apiConfig'
import { apiPlayerToPlayer, apiCourseHighScoresToCourseHighScores } from '../types/api/ModelMappers'

const getPlayers = async (): Promise<Player[]> => {
  // TODO: getFriends(user) ?
  const response = await axios.get(`${API_ROOT}/users`)
  return response.data.map((apiPlayer: ApiPlayer) => apiPlayerToPlayer(apiPlayer))
}

const playerNameAvailable = async (name: String): Promise<boolean> => {
  // TODO
  // Backend checks that there is no player (guest or normal) with 'name'. Or check just guests common among friends?
  // Note: Trim trailing whitespace.
  return name !== 'test'
}

const getHighScores = async (playerId: string): Promise<CourseHighScores[]> => {
  const response = await axios.get(`${API_ROOT}/users/highscores`, {
    params: {
      player_id: playerId,
    },
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
