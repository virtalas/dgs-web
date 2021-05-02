import axios from 'axios'

import { API_ROOT } from '../apiConfig'
import { apiPlayerToPlayer } from '../types/api/ModelMappers'

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

const getHighScores = async (playerId: string): Promise<HighScore[]> => {
  // TODO
  return [
    { courseName: 'Tali', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0)},
    { courseName: 'Kivikko', total: 54, toPar: 1, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0)},
    { courseName: 'Siltamäki', total: 54, toPar: 0, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0)},
    { courseName: 'Talfsgregi', total: 54, toPar: -10, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Talit5y5ey', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Talitef', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Taligfd', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Tali453', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Talis3r', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Tali6i7', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Tali0p', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Talilij', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Tahgdli', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Kigtdrvikko', total: 54, toPar: 1, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Sil453tamäki', total: 54, toPar: 0, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Taljyffsgregi', total: 54, toPar: -10, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Taljhkit5y5ey', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Tali9outef', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Taliwr3gfd', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Tafeli453', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Taglis3r', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Tagnli6i7', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Ta6urli0p', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
    { courseName: 'Taglilij', total: 54, toPar: -2, gameId: 'grjio49gj', gameDate: new Date(2020, 4, 13, 9, 22, 0) },
  ]
}

export default {
  getPlayers,
  playerNameAvailable,
  getHighScores,
}
