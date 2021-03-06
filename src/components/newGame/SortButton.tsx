import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { sortCourses } from '../../types/api/ModelMappers'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 5,
    minWidth: 120,
  },
}))

interface Props {
  courses: Course[] | ListCourse[],
  setCourses: (courses: Course[] | ListCourse[]) => void,
  sortByPopularity: boolean,
  setSortByPopularity: (sortByPopularity: boolean) => void,
}

const SortButton: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { courses, setCourses, sortByPopularity, setSortByPopularity } = props

  const handleSortChange = () => {
    const sorted = sortCourses(courses, !sortByPopularity)
    setCourses(sorted)
    setSortByPopularity(!sortByPopularity)
  }

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <FormHelperText>Sorted by</FormHelperText>
      <Button
        variant="outlined"
        id="course-order"
        size="small"
        onClick={handleSortChange}
        disabled={courses.length <= 1}
      >
        {sortByPopularity ? 'Most played' : 'Name'}
      </Button>
    </FormControl>
  )
}

export default SortButton
