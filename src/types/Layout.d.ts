// Common information to all layout types
interface Layout {
  id: string,
  active: boolean,
  name: string,
}

interface BasicLayout extends Layout {}

interface GameLayout extends Layout {
  holes: Hole[],
  total: number,
  mapURL: string,
}

interface DetailedLayout extends Layout {
  description: string,
  holes: Hole[],
  total: number,
  mapURL: string,
  allowedToEdit: boolean,
  numberOfGamesUniversal: number,
}
