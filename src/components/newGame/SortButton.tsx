import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 5,
    minWidth: 120,
  },
}))

interface Props {
  courses: Course[],
  setCourses: (courses: Course[]) => void,
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
      <Button variant="outlined" id="course-order" size="small" onClick={handleSortChange}>
        {sortByPopularity ? 'Popularity' : 'Name'}
      </Button>
    </FormControl>
  )
}

export function sortCourses(courses: Course[], sortByPopularity: boolean): Course[] {
  return courses.sort((a, b) => {
    if (sortByPopularity) {
      return b.numberOfGames - a.numberOfGames
    }
    return a.name > b.name ? 1 : -1
  })
}

export default SortButton
