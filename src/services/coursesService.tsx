const mockCourses: Course[] = [
  {
    id: 'fsdfefesd',
    name: 'Tali',
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

export default {
  getCourses,
}
