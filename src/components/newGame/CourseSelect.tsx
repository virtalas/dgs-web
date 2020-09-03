import React, { useState, useEffect } from 'react'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'

import coursesService from '../../services/coursesService'

interface Props {
  formControlStyle: string,
  course: Course,
  setCourse: (course: Course) => void,
  layout: Layout,
  setLayout: (layout: Layout) => void,
  setGameCreatable: (creatable: boolean) => void,
}

const CourseSelect: React.FC<Props> = (props) => {
  const { formControlStyle, course, setCourse, layout, setLayout, setGameCreatable } = props

  const [courses, setCourses] = useState<Course[]>([course])

  function getActiveLayout(forCourse: Course): Layout {
    const layout = forCourse.layouts.find(layout => layout.active)
    return layout !== undefined ? layout : {id: '', name: '', active: false}
  }

  function selectActiveLayout(forCourse: Course) {
    setLayout(getActiveLayout(forCourse))
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
    setLayout(selectedLayout)
  }

  useEffect(() => {
    // Fetch courses.
    coursesService.getCourses().then(fetchedCourses => {
      setCourses(fetchedCourses)
      setCourse(fetchedCourses[0]) // Courses should be ordered by popularity (at least initially).
      selectActiveLayout(fetchedCourses[0])
      setGameCreatable(true) // Even if the fetching of players fails, one player (user) and a course is enough.
    })
  }, [])

  const courseSelect = (
    <FormControl variant="outlined" className={formControlStyle}>
      <InputLabel>Course</InputLabel>
      <Select
        value={course.id}
        onChange={handleCourseChange}
        variant="outlined"
      >
        {courses.map((course, index) => (
          <MenuItem value={course.id} key={index}>{course.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const layoutSelect = (
    <FormControl variant="outlined" className={formControlStyle}>
      <InputLabel>Layout</InputLabel>
      <Select
        value={layout.id}
        onChange={handleLayoutChange}
        variant="outlined"
      >
        {course.layouts.map((layout, index) => (
          <MenuItem value={layout.id} key={index}>{layout.name}{layout.active ? ' (current)' : ''}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{layout !== getActiveLayout(course) ? 'This layout will become the new current layout (TODO)' : ''}</FormHelperText>
    </FormControl>
  )

  return (
    <div>
      {courseSelect}
      <br />
      {layoutSelect}
    </div>
  )
}

export default CourseSelect
