import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

import coursesService from '../../services/coursesService'
import EditCourse from './EditCourse'

// TODO: Feature for uploading a picture of the course. (use same preview as NewLayout.tsx)

const NewCourse: React.FC<{}> = () => {
  const [redirect, setRedirect] = useState(false)
  const [courseId, setCourseId] = useState('')

  // Redirect user to create a layout for the new course.
  if (redirect) {
    return <Redirect to={'/courses/new/layout/' + courseId} />
  }

  const handleCreateCourse = (course: Course) => {
    coursesService.createCourse(course).then(course => {
      setCourseId(course.id)
      setRedirect(true)
    })
  }

  return (
    <EditCourse handleFinish={handleCreateCourse} />
  )
}

export default NewCourse
