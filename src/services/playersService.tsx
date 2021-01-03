const mockPlayers = [
  {
    id: 'fgdghh',
    firstName: 'Seppo',
    guest: false,
    admin: false,
  }, {
    id: 'hfyj',
    firstName: 'Matti',
    guest: false,
    admin: false,
  },
  {
    id: 'fdjskfl83fhsgls', // Fake logged in user.
    firstName: 'Konsta',
    guest: false,
    admin: false,
  },
  {
    id: 'gfsfdsf4gh',
    firstName: 'Kaarle',
    guest: false,
    admin: false,
  },
  {
    id: 'gfsfdsdsgs3sdff4gh',
    firstName: 'Matilda',
    guest: false,
    admin: false,
  }
]

// TODO for all services (make a util):
// Add Bearer token as a header. If token expires/invalid, catch and redirect to login (where?)

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
