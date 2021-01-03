const mockCourses: Course[] = [
  {
    id: 'fsdfefesd',
    name: 'Tali',
    city: 'Helsinki',
    pars: [5,3,3,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3],
    total: 58,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout t'},
      { id: 'fdfsdg', active: false, name: '2019 layout t'}
    ],
    popularity: 556,
  },
  {
    id: 'gd5rgjffs',
    name: 'Siltamäki',
    city: 'Helsinki',
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 54,
    layouts: [
      { id: 'fddg', active: true, name: '2020 layout s'},
      { id: 'fdfsfsdg', active: false, name: '2019 layout s'}
    ],
    popularity: 476,
  },
  {
    id: 'gdh6u4sghgj',
    name: 'Kivikko',
    city: 'Helsinki',
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 54,
    layouts: [
      { id: 'fdr3eg', active: true, name: '2020 layout k'},
      { id: 'fdfuysdg', active: false, name: '2019 layout k'}
    ],
    popularity: 417,
  }
]

const getCourses = async (): Promise<Course[]> => {
  // TODO
  return mockCourses
}

const getCourse = async (id: string): Promise<Course> => {
  // TODO
  return mockCourses[0]
}

const createLayout = async (courseId: string, name: string, description: string, mapURL: string, pars: number[]): Promise<Layout> => {
  // TODO
  return { id: 'fdfuysdg', active: false, name: '2019 layout k' }
}

const createCourse = async (name: string, city: string): Promise<Course> => {
  // TODO
  return {
    id: 'newly_created_id_hgurskgfg',
    name: 'Tali',
    city: 'Helsinki',
    pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3],
    total: 58,
    layouts: [],
    popularity: 556,
  }
}

export default {
  getCourses,
  getCourse,
  createLayout,
  createCourse,
}
