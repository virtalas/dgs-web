import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import { makeStyles } from '@material-ui/styles'

import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Chip from '@material-ui/core/Chip'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'

import gamesService from '../../services/gamesService'
import coursesService from '../../services/coursesService'

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
  const [course, setCourse] = useState<Course>({id: '', name: 'Loading...', pars: [], total: 0, layouts: []})
  const [layout, setLayout] = useState<Layout>({id: '', name: 'Loading...', active: false})
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([user]) // Pre-select the user as a player.

  const [courses, setCourses] = useState<Course[]>([course])
  const [players, setPlayers] = useState<Player[]>([user])

  useEffect(() => {
    // Fetch courses.
    coursesService.getCourses().then(courses => {
      setCourses(courses)
      setCourse(courses[0]) // Courses should be ordered by popularity (at least initially).
      const activeLayout = courses[0].layouts.find(layout => layout.active) as Layout
      setLayout(activeLayout)
    })
    // Fetch players.
    // TODO
    // playersService.getPlayers().then(players => {
    //   setPlayers(players)
    //
    // })
    setPlayers([user, {id: 'fgdghh', firstName: 'Seppo', guest: false}, {id: 'hfyj', firstName: 'Matti', guest: false}])
  }, [])

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
    const selectedCourseId = value.props.value
    const selectedCourse = courses.find(course => course.id === selectedCourseId) as Course
    setCourse(selectedCourse)
  }

  const handleLayoutChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    // TODO
  }

  const handlePlayersChange = (event: React.ChangeEvent<{ value: unknown }>, value: any) => {
    const selectedPlayerId = value.props.value
    const selectedPlayer = players.find(player => player.id === selectedPlayerId) as Player

    let updatedSelectedPlayers
    if (selectedPlayers.includes(selectedPlayer)) { // Remove if clicked again
      updatedSelectedPlayers = selectedPlayers.filter(player => player.id !== selectedPlayerId)
    } else { // Add
      updatedSelectedPlayers = [...selectedPlayers, selectedPlayer]
    }
    setSelectedPlayers(updatedSelectedPlayers)
  }

  const handleAddGuest = () => {
    setDialogOpen(false)
    // TODO: Add guest to players without ID. Backend should then later create the player.
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
          <MenuItem value={layout.id} key={index}>{layout.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  // TODO: Add space for displaying guest players
  const playerChips = (
    <FormControl className={classes.formControl} error={selectedPlayers.length === 0}>
      <InputLabel id="demo-mutiple-chip-label">Players</InputLabel>
      <Select
        multiple
        value={selectedPlayers}
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
        {players.map((player) => (
          <MenuItem key={player.id} value={player.id}>
            <Checkbox checked={selectedPlayers.indexOf(player) > -1} color="primary" />
            <ListItemText primary={player.firstName} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  const addGuestButton = (
    <div>
      <Button onClick={() => setDialogOpen(true)}>New guest</Button>
      <Dialog disableBackdropClick disableEscapeKeyDown open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>New guest</DialogTitle>
        <DialogContent>
          <form className={classes.dialogContainer}>
            Name:
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddGuest} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

  // TODO: change input variant to outlined. Currently not working.
  return (
    <div id="newGamePage" className={classes.page}>
      {courseSelect}
      {layoutSelect}
      <br/>
      {playerChips}
      <br/>
      {addGuestButton}
      <br/>
      <Button variant="contained" color="primary" onClick={handleStartButtonClick}>
        New game
      </Button>
    </div>
  )
}

export default NewGame
