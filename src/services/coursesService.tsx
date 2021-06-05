import { CancelTokenSource } from "axios"
import { apiDetailedCourseToCourse, apiDetailedLayoutToLayout, apiCourseToCourse, sortCourses } from "../types/api/ModelMappers"

import baseService from './baseService'

const getCourses = async (source: CancelTokenSource): Promise<Course[]> => {
  const response = await baseService.get('/courses', source)
  const courses = response.data.map((apiCourse: ApiCourse) => apiCourseToCourse(apiCourse))
  return sortCourses(courses, true)
}

const getCourse = async (courseId: string, source: CancelTokenSource): Promise<Course> => {
  const response = await baseService.get(`/courses/${courseId}`, source)
  return apiDetailedCourseToCourse(response.data)
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
    lat: course.lat,
    lon: course.lon,
  })
  return response.data
}

const updateCourse = async (course: Course, source: CancelTokenSource): Promise<Course> => {
  const response = await baseService.put('/courses', source, {
    id: course.id,
    name: course.name,
    city: course.city,
    lat: course.lat,
    lon: course.lon,
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

const deleteCourse = async (course: Course, source: CancelTokenSource): Promise<{}> => {
  const response = await baseService.delete_('/courses', source, {
    id: course.id,
  })
  return response.data
}

const deleteLayout = async (layout: Layout, source: CancelTokenSource): Promise<{}> => {
  const response = await baseService.delete_('/courses/layouts', source, {
    id: layout.id,
  })
  return response.data
}

export default {
  getCourses,
  getCourse,
  createLayout,
  createCourse,
  updateLayoutActiveness,
  updateCourse,
  updateLayout,
  deleteCourse,
  deleteLayout,
}
