import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import PlayerSelect from './PlayerSelect'
import CourseSelect from './CourseSelect'
import NewGuestButton from './NewGuestButton'
import gamesService from '../../services/gamesService'
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

  const [allPlayers, setAllPlayers] = useState<Player[]>([user])

  useEffect(() => {
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

  // TODO: Change input variant to outlined. Currently not working.
  // TODO: 'Course', 'Layout', and 'Players' InputLabels are offset.
  return (
    <div id="newGamePage" className={classes.page}>
      <CourseSelect
        formControlStyle={classes.formControl}
        course={course}
        setCourse={setCourse}
        layout={layout}
        setLayout={setLayout}
        setGameCreatable={setGameCreatable}
      />
      <PlayerSelect
        formControlStyle={classes.formControl}
        players={players}
        setPlayers={setPlayers}
        allPlayers={allPlayers}
        setGameCreatable={setGameCreatable}
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
