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

  const [course, setCourse] = useState<Course>({id: 'Loading...', name: '', pars: [], total: 0})
  const [courses, setCourses] = useState<Course[]>([course])

  // Fetch courses.
  coursesService.getCourses().then(courses => {
    setCourses(courses)
    setCourse(courses[0]) // Courses should be ordered by popularity (at least initially).
  })

  // useEffect works like componentDidMount.
  // Will be rerun each time 'course' changes.
  useEffect(() => {
    // TODO: Fetch layouts for selected course.
    // TODO: The active layout(?) should be selected automatically.
  }, [course])

  const handleStartButtonClick = async () => {
    // Create a new game, then redirect to '/games/:newGameId/input'.
    const newGame = await gamesService.createGame()
    setNewGameId(newGame.id)
    setRedirect(true)
  }

  const handleCourseChange = async (event: React.ChangeEvent<{ value: unknown }>) => {

  }

  if (redirect) {
    return <Redirect to={'/games/' + newGameId + "/input"} />
  }

  // TODO: change input variant to outlined. Currently not working.
  return (
    <div id="newGamePage" className={classes.page}>
      <FormControl variant="outlined" className={classes.formControl}>
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
      <p>Choose layout:</p>
      <p>Choose players:</p>
      <Button variant="contained" color="primary" onClick={handleStartButtonClick}>
        Start a new game
      </Button>
    </div>
  )
}

export default NewGame
