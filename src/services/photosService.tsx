import { CancelTokenSource } from "axios"
import {
  apiPhotoToPhoto,
} from "../types/api/ModelMappers"

import baseService from './baseService'

const uploadGamePhoto = async (gameId: string, photoData: any, thumbnailData: any, source: CancelTokenSource): Promise<Photo> => {
  const response = await baseService.post('/photos/games', source, {
    'game_id': gameId,
    'photo': photoData,
    'thumbnail': thumbnailData,
  })
  return apiPhotoToPhoto(response.data)
}

const uploadCoursePhoto = async (courseId: string, photoData: any, thumbnailData: any, source: CancelTokenSource): Promise<Photo> => {
  const response = await baseService.post('/photos/courses', source, {
    'course_id': courseId,
    'photo': photoData,
    'thumbnail': thumbnailData,
  })
  return apiPhotoToPhoto(response.data)
}

const deletePhoto = async (photo: Photo, source: CancelTokenSource): Promise<{}> => {
  const response = await baseService.delete_('/photos', source, {
    photo_id: photo.id,
  })
  return response.data
}

export default {
  uploadGamePhoto,
  deletePhoto,
  uploadCoursePhoto,
}
