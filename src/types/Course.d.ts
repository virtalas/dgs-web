interface Course {
  id: string,
  name: string,
  city: string,
  layouts: Layout[],
  allowedToEdit: boolean | undefined,
  numberOfGames: number,
}
