interface Course {
  id: string,
  name: string,
  city: string,
  layouts: Layout[],
  popularity: number, // TODO: Change to numberOfGames
}
