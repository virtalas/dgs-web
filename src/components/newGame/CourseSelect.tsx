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
import { sortByName, sortCourses } from '../../types/api/ModelMappers'
import baseService from '../../services/baseService'
import { getUserLocation } from '../../utils/Utils'
import { CourseSort } from '../../types/enums/CourseSort'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 5,
    minWidth: 120,
  },
  noSelectionText: {
    color: 'grey',
  }
}))

interface Props {
  onCourseChange?: (course: Course) => void,
  layout?: Layout,
  setLayout?: (layout: Layout | undefined) => void,
  setGameCreatable?: (creatable: boolean) => void,
  chooseNearest?: boolean,
  preselectedCourseId?: string,
}

// TODO: Spread controls out if there is space. They are too packed together on desktop.
// TODO: Search function for courses.

const CourseSelect: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { onCourseChange, layout, setLayout, setGameCreatable, chooseNearest, preselectedCourseId } = props
  const useLocation = chooseNearest !== undefined ? chooseNearest : true

  const [course, setCourse] = useState<BasicCourse>()
  const [courses, setCourses] = useState<Course[]>([])
  const [sortBy, setSortBy] = useState(CourseSort.byName)

  const showLayoutSelect = setLayout !== undefined

  const changeCourseTo = (selectedCourse: BasicCourse) => {
    selectedCourse.layouts = sortByName(selectedCourse.layouts)
    setCourse(selectedCourse)
    if (onCourseChange) {
      onCourseChange(selectedCourse)
    }
  }

  const getActiveLayout = (forCourse?: BasicCourse): Layout | undefined => {
    if (!forCourse) {
      return undefined
    }
    const layout = forCourse.layouts.find(layout => layout.active)
    return layout
  }

  const selectActiveLayout = (forCourse: BasicCourse) => {
    const activeLayout = getActiveLayout(forCourse)
    if (setLayout) {
      setLayout(activeLayout)
    }
  }

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedCourseId = value.props.value as string
    const selectedCourse = courses.find(course => course.id === selectedCourseId) as BasicCourse
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

  const attemptToGetUserLocation = (completion?: (lat: number | undefined, lon: number | undefined) => void) => {
    if (!navigator.geolocation) {
      console.log('Failed to access location: navigator.geolocation not supported')
      return
    }
    getUserLocation(completion)
  }

  const attemptToSelectClosestCourse = async (sortedCourses: Course[]) => {
    attemptToGetUserLocation((userLat: number | undefined, userLon: number | undefined) => {
      if (userLat === undefined || userLon === undefined || sortedCourses.length === 0) {
        // No location information available: Choose the most visited course.
        changeCourseTo(sortedCourses[0] as BasicCourse)
        selectActiveLayout(sortedCourses[0] as BasicCourse)  
        return
      }
      
      const closestCourse = sortedCourses.reduce((a, b) => distance(a, userLat, userLon) < distance(b, userLat, userLon) ? a : b)
      changeCourseTo(closestCourse as BasicCourse)
      selectActiveLayout(closestCourse as BasicCourse)
    })
  }

  useEffect(() => {
    const cancelTokenSource = baseService.cancelTokenSource()
    coursesService.getBasicCourses(cancelTokenSource).then(async (fetchedCourses) => {
      if (fetchedCourses.length === 0) {
        return
      }

      const sortedFetchedCourses = sortCourses(fetchedCourses, sortBy)
      setCourses(sortedFetchedCourses)

      if (useLocation && setGameCreatable) {
        setGameCreatable(true) // Even if the fetching of players fails, one player (user) and a course is enough.
      }

      if (useLocation) {
        attemptToSelectClosestCourse(sortedFetchedCourses)
      }

      if (preselectedCourseId) {
        const preselectedCourse = fetchedCourses.find(c => c.id === preselectedCourseId)
        
        if (preselectedCourse && onCourseChange) {
          preselectedCourse.layouts = sortByName(preselectedCourse.layouts)
          setCourse(preselectedCourse)
          onCourseChange(preselectedCourse)
        }
      }
    })

    if (useLocation) {
      // Ping the user to give their location first, then it can be accessed without a prompt once courses arrive.
      attemptToGetUserLocation()
    }

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
        disabled={courses ? courses.length <= 1 : true}
        input={<OutlinedInput labelWidth={labelWidth} name="course" id="course-select" inputProps={{  }} />}
        renderValue={option => course?.name ?? ''}
      >
        {!useLocation ? (
          <MenuItem value={undefined} className={classes.noSelectionText}>
            — Any course —
          </MenuItem>
        ) : null}

        {courses.map((course, index) => (
          <MenuItem value={course.id} key={index}>
            {sortBy === CourseSort.byCity ? `${course.city}, ${course.name}` : `${course.name}, ${course.city}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const activeLayouts = course?.layouts.filter(layout => layout.active)
  const inactiveLayouts = course?.layouts.filter(layout => !layout.active)

  const layoutSelect = (
    <FormControl variant="outlined" className={classes.formControl} error={course !== undefined && layout === undefined}>
      <InputLabel ref={inputLabel} htmlFor="layout-select">Layout</InputLabel>
      <Select
        value={layout ? layout.id : ''}
        onChange={handleLayoutChange}
        disabled={course ? course.layouts.length <= 1 : true}
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
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <br />
      {showLayoutSelect ? layoutSelect : null}
    </div>
  )
}

// https://stackoverflow.com/a/21623206
function distance(to: Course, userLat: number, userLon: number) {
  if (!to.lat || !to.lon) return Number.MAX_SAFE_INTEGER

  const p = 0.017453292519943295 // Math.PI / 180
  const c = Math.cos
  const a = 0.5 - c((to.lat - userLat) * p)/2 +
          c(userLat * p) * c(to.lat * p) *
          (1 - c((to.lon - userLon) * p))/2

  return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
}

export default CourseSelect
