import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import { sortCourses } from '../../types/api/ModelMappers'
import DisableableButton from '../DisableableButton'

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginLeft: 5,
    marginTop: 9,
    minWidth: 120,
  },
  buttonText: {
    minWidth: 100,
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
      
      <DisableableButton
        variant="outlined"
        size="small"
        onClick={handleSortChange}
        disabled={courses.length <= 1}
      >
        <div className={classes.buttonText}>
          {sortByPopularity ? 'Most played' : 'Name'}
        </div>
      </DisableableButton>
    </FormControl>
  )
}

export default SortButton
