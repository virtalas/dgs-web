import React, { useState } from 'react'
import { Redirect } from 'react-router'

import Button from '@material-ui/core/Button'

import gamesService from '../../services/gamesService'

const NewGame: React.FC<{}> = () => {
  const [redirect, setRedirect] = useState(false)
  const [newGameId, setNewGameId] = useState('')

  const handleStartButtonClick = async () => {
    // Create a new game, then redirect to '/games/:newGameId/input'.
    const newGame = await gamesService.createGame()
    setNewGameId(newGame.id)
    setRedirect(true)
  }

  if (redirect) {
    return <Redirect to={'/games/' + newGameId + "/input"} />
  }

  return (
    <div id="newGamePage">
      <p>Choose course:</p>
      <p>Choose layout:</p>
      <p>Choose players:</p>
      <Button variant="contained" color="primary" onClick={handleStartButtonClick}>
        Start a new game
      </Button>
    </div>
  )
}

export default NewGame
