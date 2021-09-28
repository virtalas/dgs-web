import React, { useEffect, useState } from 'react'

import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import GameCard from '../gameCard/GameCard'
import { sneakyGrey } from '../../constants/Colors'

const useStyles = makeStyles((theme) => ({
  gameContainer: {
    paddingTop: theme.spacing(7),
  },
  bottomContainer: {
    height: theme.spacing(30),
    position: 'relative',
  },
  centerContainer: {
    // paddingTop: theme.spacing(2),
    margin: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: 150,
    height: 40,
  },
  syncText: {
    color: sneakyGrey,
    paddingBottom: theme.spacing(2),
  },
}))

interface Props {
  game: Game,
  updateGame: (game: Game) => void,
  handleFinish: () => void,
  availableWeatherConditions: Tag[],
  availableConditions: Tag[],
  updating: boolean,
}

// TODO: Editable comment area (grey placeholder text: "Click to edit")
// TODO: Editable conditions & illegal/high scorers: greyed out buttons that activate when tapped.
// TODO: Make progress circle visible after editing comment etc.

const GameInfoView: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { game, updateGame, handleFinish, availableWeatherConditions, availableConditions, updating } = props

  const [finished, setFinished] = useState(false)

  useEffect(() => {
    game.endDate = new Date() // Update the game finish time automatically.
    updateGame(game)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFinishClicked = () => {
    setFinished(true) // TODO: Error handling if finish request fails
    handleFinish()
  }

  return (
    <div id="gameInfoView">
      <div className={classes.gameContainer}>
        <GameCard
          game={game}
          setGame={updateGame}
          editOnly={true}
          autoUpdating={updating}
          disableScoreEditing={true}
          availableWeatherConditions={availableWeatherConditions}
          availableConditions={availableConditions}
        />
      </div>
      <div className={classes.bottomContainer}>
        <div className={classes.centerContainer}>
          <Typography className={classes.syncText}>
            {updating ? 'Syncing game...' : 'Game synced.'}
          </Typography>
          <Button variant="contained" color="primary" disabled={finished} onClick={handleFinishClicked}>
            Finish game
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GameInfoView
