interface Course {
  id: string,
  name: string,
  city: string,
  lat: number | undefined,
  lon: number | undefined,
  layouts: Layout[],
  allowedToEdit: boolean | undefined,
  numberOfGames: number,
}
