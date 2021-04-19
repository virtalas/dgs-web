import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import coursesService from '../../services/coursesService'
import CourseCard from './CourseCard'
import SortButton from '../newGame/SortButton'

const useStyles = makeStyles((theme) => ({
  page: {
    maxWidth: 600,
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(11),
  },
}))

// TODO: "Expand" arrow next to name, OR clicking takes to /courses/show/:id ?

const Courses: React.FC<{}> = () => {
  const classes = useStyles()

  const [courses, setCourses] = useState<Course[]>([])
  const [sortByPopularity, setSortByPopularity] = useState(true)

  useEffect(() => {
    coursesService.getCourses().then(c => setCourses(c))
  }, [])

  const courseCards = courses?.map(course => (
    <CourseCard
      key={'course-card-' + course.id}
      course={course}
    />
  ))

  return (
    <div id="coursesPage" className={classes.page}>
      <SortButton
        courses={courses}
        setCourses={setCourses}
        sortByPopularity={sortByPopularity}
        setSortByPopularity={setSortByPopularity}
      />
      {courseCards}
    </div>
  )
}

export default Courses
