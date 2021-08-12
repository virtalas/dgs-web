interface ApiListCourse {
  id: string,
  name: string,
  city: string,
  lat: number | undefined,
  lon: number | undefined,
  number_of_games: number,
  photo: ApiPhoto | undefined,
}

interface ApiBasicCourse {
  id: string,
  name: string,
  city: string,
  lat: number | undefined,
  lon: number | undefined,
  layouts: ApiBasicLayout[],
  number_of_games: number,
}

interface ApiDetailedCourse {
  id: string,
  name: string,
  city: string,
  lat: number,
  lon: number,
  layouts: ApiDetailedLayout[],
  allowed_to_edit: boolean,
  number_of_games: number,
  photo: ApiPhoto | undefined,
  photos: ApiPhoto[],
}

interface ApiBasicLayout {
  id: string,
  active: boolean,
  name: string,
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
  number_of_games_universal: number,
}
