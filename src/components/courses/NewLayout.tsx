import { CancelTokenSource } from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { Redirect } from 'react-router-dom'

import baseService from '../../services/baseService'
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
    { id: '', name: 'Loading...', city: '', lat: undefined, lon: undefined, layouts: [], allowedToEdit: undefined, numberOfGames: 0 }
  )

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.getCourse(courseId, cancelTokenSourceRef.current).then(c => setCourse(c))
    return () => cancelTokenSourceRef.current?.cancel()
  }, [courseId])

  // TODO: Redirect to newly created Layout's view?
  if (redirect) {
    return <Redirect to={'/courses'} />
  }

  const handleCreateLayout = (layout: Layout) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    coursesService.createLayout(courseId, layout, cancelTokenSourceRef.current).then(() => setRedirect(true))
  }

  return (
    <EditLayout
      course={course}
      handleFinish={handleCreateLayout}
    />
  )
}

export default NewLayout
