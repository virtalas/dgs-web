const mockCourses: Course[] = [
  {
    id: 'fsdfefesd',
    name: 'Tali',
    pars: [5,3,3,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3],
    total: 58,
  },
  {
    id: 'gd5rgjffs',
    name: 'Siltamäki',
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 54,
  },
  {
    id: 'gdh6u4sghgj',
    name: 'Kivikko',
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 54,
  }
]

const getCourses = async (): Promise<Course[]> => {
  // TODO
  return mockCourses
}

export default {
  getCourses,
}
