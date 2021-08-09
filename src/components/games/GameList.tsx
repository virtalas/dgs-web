import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress, Grow } from '@material-ui/core'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import GameCard from '../gameCard/GameCard'

export const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  centerContainer: {
    height: theme.spacing(30),
    position: 'relative',
    zIndex: -1, // Don't block navigation controls.
  },
  centerIcon: {
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
    left: '50%',
    marginTop: -10, // Align with progress spinner
    marginLeft: -35, // Align with progress spinner
  },
  noSearch: {
    color: 'grey',
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -10, // Align with progress spinner
    marginLeft: -110, // Align with progress spinner
  },
  errorText: {
    color: 'grey',
    margin: 0,
    position: 'absolute',
    top: '50%',
    marginTop: 20,
    left: '50%',
    marginLeft: -65,
    transform: 'translate(-50 %, -50 %)',
  }
}))

interface Props {
  gamesToShow: Game[],
  setGame: (game: Game) => void,
  onGameDeleted: (game: Game) => void,
  availableWeatherConditions: Tag[],
  availableConditions: Tag[],
  isLoading: boolean,
  isError: boolean,
  onEditToggle: (isEditing: boolean) => void,
  searchConditionsEmpty?: boolean,
}

const GameList: React.FC<Props> = (props) => {
  const classes = useStyles()

  const {
    gamesToShow,
    setGame,
    onGameDeleted,
    availableWeatherConditions,
    availableConditions,
    isLoading,
    isError,
    onEditToggle,
    searchConditionsEmpty
  } = props
  
  return (
    <div>
      {gamesToShow.map((game, index) => (
        <Grow key={'grow' + index} in={true} {...{ timeout: Math.min(1000, index * 300 + 100) }}>
          <div>
            <GameCard
              game={game}
              setGame={setGame}
              onGameDeleted={onGameDeleted}
              availableWeatherConditions={availableWeatherConditions}
              availableConditions={availableConditions}
              onEditToggle={onEditToggle}
              key={game.id}
            />
          </div>
        </Grow>
      ))}

      {gamesToShow.length === 0 && isLoading ? (
        <div className={classes.centerContainer}>
          <CircularProgress className={classes.centerIcon} />
        </div>
      ) : null}

      {gamesToShow.length === 0 && isError ? (
        <div className={classes.centerContainer}>
          <ErrorOutlineIcon className={classes.centerIcon} />
          <span className={classes.errorText}>Failed to load games</span>
        </div>      
      ) : null}

      {gamesToShow.length === 0 && !isLoading && !isError && !searchConditionsEmpty ? (
        <div className={classes.centerContainer}>
          <div className={classes.noGames}>
            No games
          </div>
        </div>
      ) : null}

      {searchConditionsEmpty ? (
        <div className={classes.centerContainer}>
          <div className={classes.noSearch}>
            Select conditions to search games
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default GameList
