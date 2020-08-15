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

const getAllPlayers = async (): Promise<Player[]> => {
  // TODO
  return mockPlayers
}

export default {
  getAllPlayers,
}
