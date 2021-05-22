import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import ListSubheader from '@material-ui/core/ListSubheader'

import coursesService from '../../services/coursesService'
import SortButton from './SortButton'
import { sortCourses } from './SortButton'
import baseService from '../../services/baseService'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 5,
    minWidth: 120,
  },
}))

interface Props {
  onCourseChange?: (course: Course) => void,
  layout?: Layout,
  setLayout?: (layout: Layout) => void,
  setGameCreatable?: (creatable: boolean) => void,
}

// TODO: Spread controls out if there is space. They are too packed together on desktop.
// TODO: Search function for courses.

const CourseSelect: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { onCourseChange, layout, setLayout, setGameCreatable } = props

  const [course, setCourse] = useState<Course>()
  const [courses, setCourses] = useState<Course[]>([])
  const [sortByPopularity, setSortByPopularity] = useState(true)

  const showLayoutSelect = setLayout !== undefined

  const changeCourseTo = (selectedCourse: Course) => {
    setCourse(selectedCourse)
    if (onCourseChange) {
      onCourseChange(selectedCourse)
    }
  }

  const getActiveLayout = (forCourse?: Course): Layout | undefined => {
    if (!forCourse) {
      return undefined
    }
    const layout = forCourse.layouts.find(layout => layout.active)
    return layout
  }

  const selectActiveLayout = (forCourse: Course) => {
    const activeLayout = getActiveLayout(forCourse)
    if (activeLayout && setLayout) {
      setLayout(activeLayout)
    }
  }

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedCourseId = value.props.value as string
    const selectedCourse = courses.find(course => course.id === selectedCourseId) as Course
    changeCourseTo(selectedCourse)
    selectActiveLayout(selectedCourse)
  }

  const handleLayoutChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedLayoutId = value.props.value as string

    if (!selectedLayoutId) {
      return
    }

    const selectedLayout = course?.layouts.find(layout => layout.id === selectedLayoutId) as Layout
    if (setLayout) {
      setLayout(selectedLayout)
    }
  }

  useEffect(() => {
    const cancelTokenSource = baseService.cancelTokenSource()
    coursesService.getCourses(cancelTokenSource).then(fetchedCourses => {
      if (fetchedCourses.length === 0) {
        return
      }
      
      setCourses(sortCourses(fetchedCourses, sortByPopularity))
      changeCourseTo(fetchedCourses[0]) // Courses should be ordered by popularity (at least initially).
      selectActiveLayout(fetchedCourses[0])
      if (setGameCreatable) {
        setGameCreatable(true) // Even if the fetching of players fails, one player (user) and a course is enough.
      }
    })

    return () => cancelTokenSource.cancel()
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
        value={course?.id ?? ''}
        onChange={handleCourseChange}
        input={<OutlinedInput labelWidth={labelWidth} name="course" id="course-select" />}
      >
        {courses.map((course, index) => (
          <MenuItem value={course.id} key={index}>{course.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const activeLayouts = course?.layouts.filter(layout => layout.active)
  const inactiveLayouts = course?.layouts.filter(layout => !layout.active)

  const layoutSelect = (
    <FormControl variant="outlined" className={classes.formControl} error={layout === undefined && courses.length > 0}>
      <InputLabel ref={inputLabel} htmlFor="layout-select">Layout</InputLabel>
      <Select
        value={layout ? layout.id : ''}
        onChange={handleLayoutChange}
        input={<OutlinedInput labelWidth={labelWidth} name="layout" id="layout-select" />}
      >
        {activeLayouts && activeLayouts.length > 0 ? (
          <ListSubheader>Active</ListSubheader>
        ) : null}

        {activeLayouts?.map((layout, index) => (
          <MenuItem value={layout.id} key={index}>{layout.name}</MenuItem>
        ))}
        
        {inactiveLayouts && inactiveLayouts.length > 0 ? (
          <ListSubheader>Inactive</ListSubheader>
        ) : null}

        {inactiveLayouts?.map((layout, index) => (
          <MenuItem value={layout.id} key={index}>{layout.name}</MenuItem>
        ))}
      </Select>
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
      {showLayoutSelect ? layoutSelect : null}
    </div>
  )
}

export default CourseSelect
