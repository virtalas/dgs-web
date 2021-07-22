import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { sortCourses } from '../../types/api/ModelMappers'
import DisableableButton from '../DisableableButton'
import { CourseSort } from '../../types/enums/CourseSort'

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginLeft: 5,
    marginTop: 9,
    marginBottom: theme.spacing(1),
    minWidth: 120,
  },
  buttonText: {
    minWidth: 100,
  },
}))

interface Props {
  courses: Course[] | ListCourse[],
  setCourses: (courses: Course[] | ListCourse[]) => void,
  sortBy: CourseSort,
  setSortBy: (sortBy: CourseSort) => void,
  allowSortByNumberOfGames?: boolean,
}

const SortButton: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { courses, setCourses, sortBy, setSortBy, allowSortByNumberOfGames } = props

  const cycleSortBy = (): CourseSort => {
    switch (sortBy) {
      case CourseSort.byName:
        return CourseSort.byCity
      case CourseSort.byCity:
        return allowSortByNumberOfGames ? CourseSort.byNumberOfGames : CourseSort.byName
      case CourseSort.byNumberOfGames:
        return CourseSort.byName
      default:
        return CourseSort.byName
    }
  }

  const handleSortChange = () => {
    const newSortBy = cycleSortBy()
    const sorted = sortCourses(courses, newSortBy)
    setCourses(sorted)
    setSortBy(newSortBy)
  }

  let label
  switch (sortBy) {
    case CourseSort.byName:
      label = 'Name'
      break
    case CourseSort.byCity:
      label = 'City'
      break
    case CourseSort.byNumberOfGames:
      label = 'Most played'
      break
  }

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <FormHelperText>Sorted by</FormHelperText>
      
      <DisableableButton
        variant="outlined"
        size="small"
        onClick={handleSortChange}
        disabled={courses.length <= 1}
      >
        <div className={classes.buttonText}>
          {label}
        </div>
      </DisableableButton>
    </FormControl>
  )
}

export default SortButton
