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
  page: {
    margin: 20,
  },
}))

// TODO: Implement logged in user info
const user: Player = {
  id: 'fgdghh', // Same ID as mocked players from playerService
  firstName: 'Teppo',
  guest: false,
  admin: false,
}

// TODO: Update style: Don't use outlined buttons.
// TODO: Center by using Grids (e.g in NewLayout.tsx)

const NewGame: React.FC<{}> = () => {
  const classes = useStyles()

  const [redirect, setRedirect] = useState(false)
  const [newGameId, setNewGameId] = useState('')
  const [gameCreatable, setGameCreatable] = useState(false)

  const [course, setCourse] = useState<Course>(
    { id: '', name: 'Loading...', city: '', pars: [], total: 0, layouts: [], popularity: 0 }
  )
  const [layout, setLayout] = useState<Layout>({id: '', name: 'Loading...', active: false})
  const [players, setPlayers] = useState<Player[]>([user]) // Pre-select the user as a player.

  const [allPlayers, setAllPlayers] = useState<Player[]>([user])

  useEffect(() => {
    // Fetch players.
    playersService.getPlayers().then(fetchedPlayers => {
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

  // TODO: 'Course', 'Layout', and 'Players' InputLabels are offset.
  return (
    <div id="newGamePage" className={classes.page}>
      <CourseSelect
        course={course}
        setCourse={setCourse}
        layout={layout}
        setLayout={setLayout}
        setGameCreatable={setGameCreatable}
      />
      <PlayerSelect
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
