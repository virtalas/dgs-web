const mockCourses: Course[] = [
  {
    id: 'fsdfefesd',
    name: 'Tali',
    pars: [5,3,3,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3],
    total: 58,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout'},
      { id: 'fdfsdg', active: false, name: '2019 layout'}
    ],
  },
  {
    id: 'gd5rgjffs',
    name: 'Siltamäki',
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 54,
    layouts: [
      { id: 'fddg', active: true, name: '2020 layout'},
      { id: 'fdfsfsdg', active: false, name: '2019 layout'}
    ],
  },
  {
    id: 'gdh6u4sghgj',
    name: 'Kivikko',
    pars: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    total: 54,
    layouts: [
      { id: 'fdr3eg', active: true, name: '2020 layout'},
      { id: 'fdfuysdg', active: false, name: '2019 layout'}
    ],
  }
]

const getCourses = async (): Promise<Course[]> => {
  // TODO
  return mockCourses
}

export default {
  getCourses,
}
