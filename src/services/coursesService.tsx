const mockCourses: Course[] = [
  {
    id: 'fsdfefesd',
    name: 'Tali',
    city: 'Helsinki',
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout t', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://www.tallaajat.org/wordpress/wp-content/uploads/2010/03/ratakartta.gif'},
      { id: 'fdfsdg', active: false, name: '2019 layout t', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://www.tallaajat.org/wordpress/wp-content/uploads/2010/03/ratakartta.gif'}
    ],
    popularity: 556,
  },
  {
    id: 'gd5rgjffs',
    name: 'Siltamäki',
    city: 'Helsinki',
    layouts: [
      { id: 'fddg', active: true, name: '2020 layout s', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/siltamaen_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsfsdg', active: false, name: '2019 layout s', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/siltamaen_helsinki_ratakartta_2014.jpg'}
    ],
    popularity: 476,
  },
  {
    id: 'gdh6u4sghgj',
    name: 'Kivikko',
    city: 'Helsinki',
    layouts: [
      { id: 'fdr3eg', active: true, name: '2020 layout k', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfuysdg', active: false, name: '2019 layout k', description: 'Holes 3 and 7 have a temporary basket placement closer to the tee. There is a mandatory on hole 16.', pars: [5, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 4, 3], total: 58, mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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

const createLayout = async (courseId: string, layout: Layout): Promise<Layout> => {
  // TODO
  return layout
}

const updateLayout = async (layout: Layout): Promise<Layout> => {
  // TODO
  return layout
}

const createCourse = async (course: Course): Promise<Course> => {
  // TODO
  return {
    id: 'newly_created_id_hgurskgfg',
    name: 'Tali',
    city: 'Helsinki',
    layouts: [],
    popularity: 556,
  }
}

const updateCourse = async (course: Course): Promise<Course> => {
  // TODO
  return course
}

export default {
  getCourses,
  getCourse,
  createLayout,
  createCourse,
  updateLayout,
  updateCourse,
}
