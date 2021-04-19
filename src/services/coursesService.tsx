import axios from "axios"

import { API_ROOT } from '../apiConfig'

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
  const response = await axios.get(`${API_ROOT}/courses`)
  return response.data
}

const getCourse = async (courseId: string): Promise<Course> => {
  const response = await axios.get(`${API_ROOT}/courses/${courseId}`)
  return response.data
}

const createLayout = async (courseId: string, layout: Layout): Promise<Layout> => {
  const response = await axios.post(`${API_ROOT}/courses/${courseId}/layout`, {
    name: layout.name,
    description: layout.description,
    pars: layout.pars,
    mapURL: layout.mapURL,
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.data
}

const updateLayout = async (layout: Layout): Promise<Layout> => {
  // TODO
  return layout
}

const createCourse = async (course: Course): Promise<Course> => {
  const response = await axios.post(`${API_ROOT}/courses`, {
    name: course.name,
    city: course.city,
  }, {
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return response.data
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
