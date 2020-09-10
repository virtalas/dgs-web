interface Course {
  id: string,
  name: string,
  pars: number[], // TODO: Move pars inside Layout
  total: number, // TODO: Move total inside Layout
  layouts: Layout[],
  popularity: number,
}
