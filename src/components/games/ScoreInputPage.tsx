import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import CircularProgress from '@material-ui/core/CircularProgress'

import HoleInfoBar from './HoleInfoBar'
import PlayerScoreList from './PlayerScoreList'
import gamesService from '../../services/gamesService'

const useStyles = makeStyles((theme) => ({
  bottomNav: {
    bottom: 0,
  },
  progress: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    width: '50%',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
}))

const ScoreInputPage: React.FC<{}> = (props: any) => {
  const classes = useStyles()
  const gameId = props.match.params.gameid // Props type as any to avoid props.match problem.
  
  const [game, setGame] = useState()
  const [holeNum, setHoleNum] = useState(1) // TODO: Use findIndex() to start from first 0 stroked hole
  const [updating, setUpdating] = useState(false)
  const [value, setValue] = React.useState(0)

  useEffect(() => {
    gamesService.getGame(gameId).then((fetchedGame) => {
      setTimeout(function () {
        setGame(fetchedGame)
      }, 5000);
    })
  }, [gameId])
  
  const updateScores = (newScores: PlayerScores[]) => {
    const newGame = {
      ...game,
      scores: newScores,
    }
    setGame(newGame)
  }

  const handleHoleChange = () => {
    // TODO: Call updateGame only if 1 second has passed since last update
    setUpdating(true)
    gamesService.updateGame(game).then(() => {
      setUpdating(false)
    })
  }

  if (game !== undefined) {
    return (
      <div>
        <HoleInfoBar />
        <PlayerScoreList
          scores={game.scores}
          holeNumber={holeNum}
          onScoreChange={updateScores}
          updating={updating}
        />
        {/* Prev/Next hole buttons */}
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          showLabels
          className={classes.bottomNav}
        >
          <BottomNavigationAction label="Scores" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Hole info" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Map" icon={<LocationOnIcon />} />
          <BottomNavigationAction label="Game info" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </div>
    )
  } else {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>
    )
  }
}

export default ScoreInputPage
