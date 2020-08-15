import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { makeStyles } from '@material-ui/styles'

import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ListSubheader from '@material-ui/core/ListSubheader'

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
  chip: {
    margin: 2,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dialogContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}))

const itemHeight = 48
const itemPaddingTop = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: itemHeight * 4.5 + itemPaddingTop,
      width: 250,
    },
  },
}

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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [gameCreatable, setGameCreatable] = useState(false)
  const [guestNameError, setGuestNameError] = useState(false)
  const [guestName, setGuestName] = useState('')

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

  const handleAddGuest = () => {
    setDialogOpen(false)
    // Add guest to players with empty ID. Backend should then later create the player when creating the game.
    const newGuest = {
      id: 'temp-id-' + guestName, // Unique ID needed for updating the selection list.
      firstName: guestName,
      guest: true,
    }
    setPlayers([...players, newGuest])
    setAllPlayers([...allPlayers, newGuest])
  }

  const handleGuestNameChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setGuestName(event.target.value as string)
    // Check for availability (no identical names allowed)
    playersService.playerNameAvailable(event.target.value as string).then((available: boolean) => {
      setGuestNameError(!available)
    })
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

  const guests = allPlayers.filter(player => player.guest)
  const playerChips = (
    <FormControl className={classes.formControl} error={players.length === 0}>
      <InputLabel id="demo-mutiple-chip-label">Players</InputLabel>
      <Select
        multiple
        value={players}
        onChange={handlePlayersChange}
        input={<Input id="select-multiple-chip" />}
        renderValue={selected => (
          <div className={classes.chips}>
            {(selected as Player[]).map((player) => (
              <Chip key={player.id} label={player.firstName} className={classes.chip} />
            ))}
          </div>
        )}
        MenuProps={MenuProps}
      >
        {allPlayers.filter(player => !player.guest).map((player) => (
          <MenuItem key={player.id} value={player.id}>
            <Checkbox checked={players.indexOf(player) > -1} color="primary" />
            <ListItemText primary={player.firstName} />
          </MenuItem>
        ))}
        {guests.length !== 0 ? (
          <ListSubheader>Guests</ListSubheader>
        ) : null}
        {guests.map((guest) => (
          <MenuItem key={guest.id} value={guest.id}>
            <Checkbox checked={players.indexOf(guest) > -1} color="primary" />
            <ListItemText primary={guest.firstName} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{players.length === 0 ? 'Choose at least one player' : ''}</FormHelperText>
    </FormControl>
  )

  const addGuestButton = (
    <div>
      <Button onClick={() => setDialogOpen(true)}>New guest</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>New guest</DialogTitle>
        <DialogContent>
          <form className={classes.dialogContainer}>
            <TextField
              id="standard-basic"
              label="Name"
              error={guestNameError}
              value={guestName}
              helperText={guestNameError ? 'There already exists a guest with this name' : 'Check for existing guests first'}
              onChange={handleGuestNameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddGuest} color="primary" disabled={guestNameError}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

  // TODO: Change input variant to outlined. Currently not working.
  // TODO: 'Course', 'Layout', and 'Players' InputLabels are offset.
  return (
    <div id="newGamePage" className={classes.page}>
      {courseSelect}
      <br/>
      {layoutSelect}
      <br/>
      {playerChips}
      <br/>
      {addGuestButton}
      <br/>
      <Button variant="contained" color="primary" onClick={handleStartButtonClick} disabled={!gameCreatable}>
        New game
      </Button>
    </div>
  )
}

export default NewGame
