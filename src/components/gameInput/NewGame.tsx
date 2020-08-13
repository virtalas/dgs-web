import React, { useState } from 'react'
import { Redirect } from 'react-router'
import { makeStyles } from '@material-ui/styles'

import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import gamesService from '../../services/gamesService'

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

  const [course, setCourse] = useState<Course>()

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
        <InputLabel>Age</InputLabel>
        <Select
          value={course?.name}
          onChange={handleCourseChange}
          variant="outlined"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
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
