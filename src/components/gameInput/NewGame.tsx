import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { makeStyles } from '@material-ui/styles'

import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import gamesService from '../../services/gamesService'
import coursesService from '../../services/coursesService'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 1,
    minWidth: 120,
  },
  page: {
    margin: 20,
  },
}))

const NewGame: React.FC<{}> = () => {
  const classes = useStyles()

  const [redirect, setRedirect] = useState(false)
  const [newGameId, setNewGameId] = useState('')

  const [course, setCourse] = useState<Course>({id: 'Loading...', name: '', pars: [], total: 0, layouts: []})
  const [courses, setCourses] = useState<Course[]>([course])

  // Fetch courses.
  coursesService.getCourses().then(courses => {
    setCourses(courses)
    setCourse(courses[0]) // Courses should be ordered by popularity (at least initially).
  })

  const handleStartButtonClick = async () => {
    // Create a new game, then redirect to '/games/:newGameId/input'.
    const newGame = await gamesService.createGame()
    setNewGameId(newGame.id)
    setRedirect(true)
  }

  if (redirect) {
    return <Redirect to={'/games/' + newGameId + "/input"} />
  }

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedCourse = value.props.value
    setCourse(selectedCourse) // TODO: not working
    console.log(selectedCourse)
  }

  // TODO: change input variant to outlined. Currently not working.
  return (
    <div id="newGamePage" className={classes.page}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel>Course</InputLabel>
        <Select
          value={course}
          onChange={handleCourseChange}
          variant="outlined"
        >
          {courses.map((course, index) => (
            // TODO: fix ts-ignore? passing object to select value causes an error.
            // @ts-ignore
            <MenuItem value={course} key={index}>{course.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <p>Choose layout:</p>
      <p>Choose players:</p>
      <Button variant="contained" color="primary" onClick={handleStartButtonClick}>
        Start a new game
      </Button>
    </div>
  )
}

export default NewGame
