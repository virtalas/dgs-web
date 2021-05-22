import { CancelTokenSource } from "axios"
import { apiDetailedCourseToCourse, apiDetailedLayoutToLayout, apiCourseToCourse } from "../types/api/ModelMappers"

import baseService from './baseService'

const getCourses = async (source: CancelTokenSource): Promise<Course[]> => {
  const response = await baseService.get('/courses', source)
  return response.data.map((apiCourse: ApiCourse) => apiCourseToCourse(apiCourse))
}

const getCourse = async (courseId: string, source: CancelTokenSource): Promise<Course> => {
  const response = await baseService.get(`/courses/${courseId}`, source)
  return apiDetailedCourseToCourse(response.data)
}

const createLayout = async (courseId: string, layout: Layout, source: CancelTokenSource): Promise<Layout> => {
  const response = await baseService.post(`/courses/${courseId}/layouts`, source, {
    name: layout.name,
    description: layout.description,
    pars: layout.holes.map(hole => hole.par),
    mapURL: layout.mapURL,
  })
  return response.data
}

const updateLayoutActiveness = async (layout: Layout, source: CancelTokenSource): Promise<Layout> => {
  const response = await baseService.put(`/courses/layouts/active`, source, {
    id: layout.id,
    active: layout.active
  })
  return response.data
}

const createCourse = async (course: Course, source: CancelTokenSource): Promise<Course> => {
  const response = await baseService.post('/courses', source, {
    name: course.name,
    city: course.city,
  })
  return response.data
}

const updateCourse = async (course: Course, source: CancelTokenSource): Promise<Course> => {
  const response = await baseService.put('/courses', source, {
    id: course.id,
    name: course.name,
    city: course.city,
  })
  return apiDetailedCourseToCourse(response.data)
}

const updateLayout = async (layout: Layout, source: CancelTokenSource): Promise<Layout> => {
  const response = await baseService.put('/courses/layouts', source, {
    id: layout.id,
    active: layout.active,
    name: layout.name,
    description: layout.description,
    mapURL: layout.mapURL,
  })
  return apiDetailedLayoutToLayout(response.data)
}

export default {
  getCourses,
  getCourse,
  createLayout,
  createCourse,
  updateLayoutActiveness,
  updateCourse,
  updateLayout,
}
