import axios from "axios"

import { API_ROOT } from '../apiConfig'

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
    pars: layout.holes.map(hole => hole.par),
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
