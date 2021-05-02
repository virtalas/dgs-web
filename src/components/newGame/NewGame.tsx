import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { useAuth } from '../../context/AuthContext'
import { toISOStringWithTimezone } from '../../utils/DateUtils'
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

// TODO: Update style: Don't use outlined buttons.
// TODO: Center by using Grids (e.g in NewLayout.tsx)

const NewGame: React.FC<{}> = () => {
  const { userId } = useAuth()
  const classes = useStyles()

  const [redirect, setRedirect] = useState(false)
  const [newGameId, setNewGameId] = useState('')
  const [gameCreatable, setGameCreatable] = useState(false)
  const [layout, setLayout] = useState<Layout>()
  const [players, setPlayers] = useState<Player[]>([])
  const [allPlayers, setAllPlayers] = useState<Player[]>([])

  useEffect(() => {
    playersService.getPlayers().then(fetchedPlayers => {
      const user = fetchedPlayers.find(player => player.id === userId) as Player
      if (user) {
        setPlayers([user])
      }
      setAllPlayers(fetchedPlayers)
    })
  }, [userId])

  const handleStartButtonClick = async () => {
    const startDate = toISOStringWithTimezone(new Date())
    if (layout) {
      gamesService.createGame(layout, players, startDate).then(newGameId => {
        setNewGameId(newGameId.id)
        setRedirect(true)
      })
    }
  }

  if (redirect) {
    return <Redirect to={'/games/' + newGameId + "/input"} />
  }

  return (
    <div id="newGamePage" className={classes.page}>
      <CourseSelect
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
      <Button
        id="newGameButton"
        variant="contained"
        color="primary"
        onClick={handleStartButtonClick}
        disabled={!gameCreatable || layout === undefined}
      >
        New game
      </Button>
    </div>
  )
}

export default NewGame
