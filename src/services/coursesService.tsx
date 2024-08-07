import { CancelTokenSource } from "axios"
import {
  apiDetailedCourseToDetailedCourse,
  apiDetailedLayoutToDetailedLayout,
  apiListCourseToListCourse,
  apiBasicCourseToBasicCourse,
  sortCourses,
  apiHoleScoreDistributionToHoleScoreDistribution,
  apiLayoutTopScoreToLayoutTopScore,
  apiLayoutTopScoresToLayoutTopScores,
} from "../types/api/ModelMappers"
import { CourseSort } from "../types/enums/CourseSort"

import baseService from './baseService'

const getListCourses = async (source: CancelTokenSource): Promise<ListCourse[]> => {
  const response = await baseService.get('/courses', source, {
    'list': true,
  })
  const courses = response.data.map((apiCourse: ApiListCourse) => apiListCourseToListCourse(apiCourse))
  return sortCourses(courses, CourseSort.byNumberOfGames) as ListCourse[]
}

const getBasicCourses = async (source: CancelTokenSource): Promise<BasicCourse[]> => {
  const response = await baseService.get('/courses', source, {
    'basic': true,
  })
  const courses = response.data.map((apiCourse: ApiBasicCourse) => apiBasicCourseToBasicCourse(apiCourse))
  return sortCourses(courses, CourseSort.byName) as BasicCourse[]
}

const getCourse = async (courseId: string, source: CancelTokenSource): Promise<DetailedCourse> => {
  const response = await baseService.get(`/courses/${courseId}`, source)
  return apiDetailedCourseToDetailedCourse(response.data)
}

const getLayoutScoreDistribution = async (layoutId: string, source: CancelTokenSource): Promise<HoleScoreDistribution[]> => {
  const response = await baseService.get(`/courses/layouts/scoredistribution/${layoutId}`, source)
  return response.data.map((hsd: ApiHoleScoreDistribution) => apiHoleScoreDistributionToHoleScoreDistribution(hsd))
}

const getLayoutTopScores = async (layoutId: string, source: CancelTokenSource): Promise<LayoutTopScores> => {
  const response = await baseService.get(`/courses/layouts/topscores/${layoutId}`, source)
  return apiLayoutTopScoresToLayoutTopScores(response.data)
}

const createLayout = async (courseId: string, layout: DetailedLayout, source: CancelTokenSource): Promise<DetailedLayout> => {
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
    lat: course.lat,
    lon: course.lon,
  })
  return response.data
}

const updateCourse = async (course: Course, source: CancelTokenSource): Promise<DetailedCourse> => {
  const response = await baseService.put('/courses', source, {
    id: course.id,
    name: course.name,
    city: course.city,
    lat: course.lat,
    lon: course.lon,
  })
  return apiDetailedCourseToDetailedCourse(response.data)
}

const updateLayout = async (layout: DetailedLayout, source: CancelTokenSource): Promise<DetailedLayout> => {
  const response = await baseService.put('/courses/layouts', source, {
    id: layout.id,
    active: layout.active,
    name: layout.name,
    description: layout.description,
    pars: layout.holes.map(hole => hole.par),
    mapURL: layout.mapURL,
  })
  return apiDetailedLayoutToDetailedLayout(response.data)
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
  getListCourses,
  getBasicCourses,
  getCourse,
  getLayoutScoreDistribution,
  getLayoutTopScores,
  createLayout,
  createCourse,
  updateLayoutActiveness,
  updateCourse,
  updateLayout,
  deleteCourse,
  deleteLayout,
}
