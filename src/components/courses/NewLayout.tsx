import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'

import coursesService from '../../services/coursesService'
import EditLayout from './EditLayout'

interface Props {
  match: any,
}

// TODO: creating new layout gives warning

const NewLayout: React.FC<Props> = (props) => {
  const { match } = props
  const courseId = match.params.id

  const [redirect, setRedirect] = useState(false)
  const [course, setCourse] = useState<Course>(
    { id: '', name: 'Loading...', city: '', layouts: [], popularity: 0 }
  )

  useEffect(() => {
    coursesService.getCourse(courseId).then(c => setCourse(c))
  }, [course, courseId])

  // TODO: Redirect to newly created Layout's view?
  if (redirect) {
    return <Redirect to={'/courses'} />
  }

  const handleCreateLayout = (layout: Layout) => {
    coursesService.createLayout(courseId, layout).then(() => setRedirect(true))
  }

  return (
    <EditLayout
      course={course}
      handleFinish={handleCreateLayout}
    />
  )
}

export default NewLayout
