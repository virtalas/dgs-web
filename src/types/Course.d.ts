// Common information to all course types
interface Course {
  id: string,
  name: string,
  city: string,
  lat: number | undefined,
  lon: number | undefined,
}

// Used for lists of courses
interface ListCourse extends Course {
  photo: Photo | undefined,
  numberOfGames: number,
}

// Used for lists of courses and their layouts (without holes)
interface BasicCourse extends Course {
  layouts: BasicLayout[],
}

// Used for full info on a course and it's layouts (including holes)
interface DetailedCourse extends Course {
  photo: Photo | undefined,
  photos: Photo[],
  numberOfGames: number,
  layouts: DetailedLayout[],
  allowedToEdit: boolean,
}
