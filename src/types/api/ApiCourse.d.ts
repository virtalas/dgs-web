interface ApiCourse {
  id: string,
  name: string,
  city: string,
}

interface ApiDetailedCourse {
  id: string,
  name: string,
  city: string,
  layouts: ApiDetailedLayout[],
  allowed_to_edit: boolean,
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
