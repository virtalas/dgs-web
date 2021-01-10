import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import OutlinedInput from '@material-ui/core/OutlinedInput'

import coursesService from '../../services/coursesService'
import SortButton from './SortButton'
import { sortCourses } from './SortButton'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 5,
    minWidth: 120,
  },
}))

interface Props {
  course: Course,
  setCourse: (course: Course) => void,
  layout?: Layout,
  setLayout?: (layout: Layout) => void,
  setGameCreatable?: (creatable: boolean) => void,
}

// TODO: Spread controls out if there is space. They are too packed together on desktop.
// TODO: Search function for courses.

const CourseSelect: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { course, setCourse, layout, setLayout, setGameCreatable } = props

  const [courses, setCourses] = useState<Course[]>([course])
  const [sortByPopularity, setSortByPopularity] = useState(true)

  function getActiveLayout(forCourse: Course): Layout {
    const layout = forCourse.layouts.find(layout => layout.active)
    return layout !== undefined ? layout : {
      id: '', name: '', description: '', pars: [], total: 0, active: false, mapURL: ''
    }
  }

  function selectActiveLayout(forCourse: Course) {
    if (setLayout) {
      setLayout(getActiveLayout(forCourse))
    }
  }

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedCourseId = value.props.value as string
    const selectedCourse = courses.find(course => course.id === selectedCourseId) as Course
    setCourse(selectedCourse)
    selectActiveLayout(selectedCourse)
  }

  const handleLayoutChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedLayoutId = value.props.value as string
    const selectedLayout = course.layouts.find(layout => layout.id === selectedLayoutId) as Layout
    if (setLayout) {
      setLayout(selectedLayout)
    }
  }

  useEffect(() => {
    // Fetch courses.
    coursesService.getCourses().then(fetchedCourses => {
      setCourses(sortCourses(fetchedCourses, sortByPopularity))
      setCourse(fetchedCourses[0]) // Courses should be ordered by popularity (at least initially).
      selectActiveLayout(fetchedCourses[0])
      if (setGameCreatable) {
        setGameCreatable(true) // Even if the fetching of players fails, one player (user) and a course is enough.
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Used for outlined Select's input label.
  const inputLabel = React.useRef<HTMLLabelElement>(null)
  const [labelWidth, setLabelWidth] = React.useState(0)
  useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth)
  }, [])

  const courseSelect = (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} htmlFor="course-select">Course</InputLabel>
      <Select
        value={course.id}
        onChange={handleCourseChange}
        input={<OutlinedInput labelWidth={labelWidth} name="course" id="course-select" />}
      >
        {courses.map((course, index) => (
          <MenuItem value={course.id} key={index}>{course.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const layoutSelect = (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ref={inputLabel} htmlFor="layout-select">Layout</InputLabel>
      <Select
        value={layout ? layout.id : 0}
        onChange={handleLayoutChange}
        input={<OutlinedInput labelWidth={labelWidth} name="layout" id="layout-select" />}
      >
        {course.layouts.map((layout, index) => (
          <MenuItem value={layout.id} key={index}>{layout.name}{layout.active ? ' (current)' : ''}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{layout !== getActiveLayout(course) ? 'Will become the current layout.' : ''}</FormHelperText>
    </FormControl>
  )

  return (
    <div>
      {courseSelect}
      <SortButton
        courses={courses}
        setCourses={setCourses}
        sortByPopularity={sortByPopularity}
        setSortByPopularity={setSortByPopularity}
      />
      <br />
      {layout ? layoutSelect : null}
    </div>
  )
}

export default CourseSelect
