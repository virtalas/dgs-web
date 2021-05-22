interface ApiCourse {
  id: string,
  name: string,
  city: string,
  layouts: Layout[],
  number_of_games: number,
}

interface ApiDetailedCourse {
  id: string,
  name: string,
  city: string,
  layouts: ApiDetailedLayout[],
  allowed_to_edit: boolean,
  number_of_games: number,
}

interface ApiDetailedLayout {
  id: string,
  active: boolean,
  name: string,
  description: string,
  holes: Hole[],
  total: number,
  mapURL: string,
  allowed_to_edit: boolean,
}
