import { CancelTokenSource } from "axios"

import baseService from './baseService'

const getCourses = async (source: CancelTokenSource): Promise<Course[]> => {
  const response = await baseService.get('/courses', source)
  return response.data
}

const getCourse = async (courseId: string, source: CancelTokenSource): Promise<Course> => {
  const response = await baseService.get(`/courses/${courseId}/course`, source)
  return response.data
}

const createLayout = async (courseId: string, layout: Layout, source: CancelTokenSource): Promise<Layout> => {
  const response = await baseService.post(`/courses/${courseId}/layout`, source, {
    name: layout.name,
    description: layout.description,
    pars: layout.holes.map(hole => hole.par),
    mapURL: layout.mapURL,
  })
  return response.data
}

const updateLayout = async (layout: Layout): Promise<Layout> => {
  // TODO
  return layout
}

const createCourse = async (course: Course, source: CancelTokenSource): Promise<Course> => {
  const response = await baseService.post('/courses', source, {
    name: course.name,
    city: course.city,
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
