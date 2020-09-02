const mockPlayers = [
  {
    id: 'fgdghh',
    firstName: 'Seppo',
    guest: false
  }, {
    id: 'hfyj',
    firstName: 'Matti',
    guest: false
  }
]

// TODO for all services:
// Add Bearer token as a header.

const getPlayers = async (): Promise<Player[]> => {
  // TODO
  return mockPlayers
}

const playerNameAvailable = async (name: String): Promise<boolean> => {
  // TODO: Backend checks that there is no player (guest or normal) with 'name'. Note: Trim trailing whitespace.
  return name !== 'test'
}

export default {
  getPlayers,
  playerNameAvailable,
}
