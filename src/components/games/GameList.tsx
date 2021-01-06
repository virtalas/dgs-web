import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress, Grow } from '@material-ui/core'
import GameCard from '../gameCard/GameCard'

export const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  centerContainer: {
    height: theme.spacing(30),
    position: 'relative',
    zIndex: -1, // Don't block navigation controls.
  },
  progress: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  noGames: {
    color: 'grey',
    margin: 0,
    position: 'absolute',
    top: '50%',
    marginTop: -10, // Align with progress spinner
    left: '50%',
    marginLeft: -35, // Align with progress spinner
    transform: 'translate(-50 %, -50 %)',
  },
}))

interface Props {
  gamesToShow: Game[],
  setGame: (game: Game) => void,
  availableWeatherConditions: Condition[],
  availableConditions: Condition[],
  isLoading: boolean,
}

const GameList: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { gamesToShow, setGame, availableWeatherConditions, availableConditions, isLoading } = props
  
  return (
    <div>
      {gamesToShow.map((game, index) => (
        <Grow key={'grow' + index} in={true} {...{ timeout: index * 300 + 100 }}>
          <div>
            <GameCard
              game={game}
              setGame={setGame}
              availableWeatherConditions={availableWeatherConditions}
              availableConditions={availableConditions}
              key={game.id}
            />
          </div>
        </Grow>
      ))}
      {gamesToShow.length === 0 && isLoading ? (
        <div className={classes.centerContainer}>
          <CircularProgress className={classes.progress} />
        </div>
      ) : null}
      {gamesToShow.length === 0 && !isLoading ? (
        <div className={classes.centerContainer}>
          <div className={classes.noGames}>No games</div>
        </div>
      ) : null}
    </div>
  )
}

export default GameList
