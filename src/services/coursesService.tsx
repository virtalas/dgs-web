const mockCourses: Course[] = [
  {
    id: 'fsdfefesd',
    name: 'Tali',
    city: 'Helsinki',
    pars: [5,3,3,3,3,3,3,3,3,4,3,3,3,3,3,3,4,3],
    total: 58,
    layouts: [
      { id: 'fdg', active: true, name: '2020 layout t', mapURL: 'https://www.tallaajat.org/wordpress/wp-content/uploads/2010/03/ratakartta.gif'},
      { id: 'fdfsdg', active: false, name: '2019 layout t', mapURL: 'https://www.tallaajat.org/wordpress/wp-content/uploads/2010/03/ratakartta.gif'}
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
      { id: 'fddg', active: true, name: '2020 layout s', mapURL: 'https://frisbeegolfradat.fi/files/2014/05/siltamaen_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfsfsdg', active: false, name: '2019 layout s', mapURL: 'https://frisbeegolfradat.fi/files/2014/05/siltamaen_helsinki_ratakartta_2014.jpg'}
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
      { id: 'fdr3eg', active: true, name: '2020 layout k', mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'},
      { id: 'fdfuysdg', active: false, name: '2019 layout k', mapURL: 'https://frisbeegolfradat.fi/files/2014/05/kivikon_helsinki_ratakartta_2014.jpg'}
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
  return { id: 'fdfuysdg', active: false, name: '2019 layout k', mapURL: 'https://www.opendiscgolf.com/wp-content/uploads/EAO2020_Tampere_Disc_Golf_Center_Course_Map_Championship_Layout_WEB_v2.jpg' }
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
