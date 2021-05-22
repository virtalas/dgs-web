interface Course {
  id: string,
  name: string,
  city: string,
  layouts: Layout[],
  allowedToEdit: boolean | undefined,
  popularity: number, // TODO: Change to numberOfGames
}
