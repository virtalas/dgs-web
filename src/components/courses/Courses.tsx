import React, { useEffect, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import coursesService from '../../services/coursesService'
import CourseListCard from './CourseListCard'
import SortButton from '../newGame/SortButton'
import baseService from '../../services/baseService'
import LoadingView from '../LoadingView'
import { pageMaxWidth } from '../BasePage'
import { CourseSort } from '../../types/enums/CourseSort'
import Grow from '@material-ui/core/Grow'
import ErrorView from '../ErrorView'

const useStyles = makeStyles((theme) => ({
  page: {
    maxWidth: pageMaxWidth,
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(11),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  noCourses: {
    color: 'grey',
    marginTop: '20%',
    textAlign: 'center',
  },
}))

const Courses: React.FC<{}> = () => {
  const classes = useStyles()

  const [courses, setCourses] = useState<ListCourse[]>([])
  const [sortBy, setSortBy] = useState(CourseSort.byNumberOfGames)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsError(false)
    const cancelTokenSource = baseService.cancelTokenSource()
    coursesService.getListCourses(cancelTokenSource)
      .then(c => {
        setCourses(c)
        setIsLoading(false)
      })
      .catch(() => setIsError(true))

    return () => cancelTokenSource?.cancel()
  }, [])

  const courseCards = courses?.map((course, index) => (
    <Grow key={'grow' + index} in={true} {...{ timeout: Math.min(1000, index * 300 + 100) }}>
      <div>
        <CourseListCard
          key={'course-card-' + course.id}
          course={course}
          beingSortedBy={sortBy}
        />
      </div>
    </Grow>
  ))

  return (
    <div id="coursesPage" className={classes.page}>
      {courses.length > 0 ? (
        <SortButton
          courses={courses}
          setCourses={(sortedCourses: Course[] | ListCourse[]) => {
            if (sortedCourses as ListCourse[]) {
              setCourses(sortedCourses as ListCourse[])
            }
          }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allowSortByNumberOfGames={true}
        />
      ) : null}

      {courses.length === 0 && !isLoading ? (
        <div className={classes.noCourses}>No courses</div>
      ) : null}

      {courses.length === 0 && isLoading && !isError && (
        <LoadingView />
      )}

      {isError && (
        <ErrorView />
      )}

      {courseCards}
    </div>
  )
}

export default Courses
