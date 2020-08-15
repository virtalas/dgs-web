import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { makeStyles } from '@material-ui/styles'

import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import PlayerSelect from './PlayerSelect'
import NewGuestButton from './NewGuestButton'
import gamesService from '../../services/gamesService'
import coursesService from '../../services/coursesService'
import playersService from '../../services/playersService'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: 5,
    minWidth: 120,
  },
  page: {
    margin: 20,
  },
}))

// TODO: Implement logged in user info
const user: Player = {
  id: 'fdsfgfdgwrgfhg',
  firstName: 'Teppo',
  guest: false
}

const NewGame: React.FC<{}> = () => {
  const classes = useStyles()

  const [redirect, setRedirect] = useState(false)
  const [newGameId, setNewGameId] = useState('')
  const [gameCreatable, setGameCreatable] = useState(false)

  const [course, setCourse] = useState<Course>({id: '', name: 'Loading...', pars: [], total: 0, layouts: []})
  const [layout, setLayout] = useState<Layout>({id: '', name: 'Loading...', active: false})
  const [players, setPlayers] = useState<Player[]>([user]) // Pre-select the user as a player.

  const [courses, setCourses] = useState<Course[]>([course])
  const [allPlayers, setAllPlayers] = useState<Player[]>([user])

  function selectActiveLayout(forCourse: Course) {
    setLayout(forCourse.layouts.find(layout => layout.active) as Layout)
  }

  useEffect(() => {
    // Fetch courses.
    coursesService.getCourses().then(fetchedCourses => {
      setCourses(fetchedCourses)
      setCourse(fetchedCourses[0]) // Courses should be ordered by popularity (at least initially).
      selectActiveLayout(fetchedCourses[0])
      setGameCreatable(true) // Even if the fetching of players fails, one player (user) and a course is enough.
    })
    // Fetch players.
    playersService.getPlayers().then(fetchedPlayers => {
      fetchedPlayers.push(user) // TODO: Temp for mock data. Remove when 'user' ie logged in player is handeled.
      setAllPlayers(fetchedPlayers)
    })
  }, [])

  const handleStartButtonClick = async () => {
    // Create a new game, then redirect to '/games/:newGameId/input'.
    const newGame = await gamesService.createGame(course, layout, players)
    setNewGameId(newGame.id)
    setRedirect(true)
  }

  if (redirect) {
    return <Redirect to={'/games/' + newGameId + "/input"} />
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

  const handlePlayersChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedPlayerId = value.props.value as string
    const selectedPlayer = allPlayers.find(player => player.id === selectedPlayerId) as Player

    let updatedPlayers
    if (players.includes(selectedPlayer)) { // Remove if clicked again
      updatedPlayers = players.filter(player => player.id !== selectedPlayerId)
    } else { // Add
      updatedPlayers = [...players, selectedPlayer]
    }
    setPlayers(updatedPlayers)
    setGameCreatable(updatedPlayers.length >= 1)
  }

  const courseSelect = (
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
  )

  const layoutSelect = (
    <FormControl variant="outlined" className={classes.formControl}>
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
    </FormControl>
  )

  // TODO: Change input variant to outlined. Currently not working.
  // TODO: 'Course', 'Layout', and 'Players' InputLabels are offset.
  return (
    <div id="newGamePage" className={classes.page}>
      {courseSelect}
      <br/>
      {layoutSelect}
      <br/>
      <PlayerSelect
        formControlStyle={classes.formControl}
        players={players}
        handlePlayersChange={handlePlayersChange}
        allPlayers={allPlayers}
      />
      <br/>
      <NewGuestButton
        setPlayers={setPlayers}
        players={players}
        setAllPlayers={setAllPlayers}
        allPlayers={allPlayers}
      />
      <br/>
      <Button variant="contained" color="primary" onClick={handleStartButtonClick} disabled={!gameCreatable}>
        New game
      </Button>
    </div>
  )
}

export default NewGame
