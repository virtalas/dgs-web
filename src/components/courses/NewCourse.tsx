import React, { useState, useRef, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { CancelTokenSource } from 'axios'

import coursesService from '../../services/coursesService'
import EditCourse from './EditCourse'
import baseService from '../../services/baseService'

// TODO: Feature for uploading a picture of the course. (use same preview as NewLayout.tsx)

const NewCourse: React.FC<{}> = () => {
  const [redirect, setRedirect] = useState(false)
  const [courseId, setCourseId] = useState('')

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel())

  // Redirect user to create a layout for the new course.
  if (redirect) {
    return <Redirect to={'/courses/new/layout/' + courseId} />
  }

  const handleCreateCourse = (course: Course) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.createCourse(course, cancelTokenSourceRef.current).then(course => {
      setCourseId(course.id)
      setRedirect(true)
    })
  }

  return (
    <EditCourse handleFinish={handleCreateCourse} />
  )
}

export default NewCourse
