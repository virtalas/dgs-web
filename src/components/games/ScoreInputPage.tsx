import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import HoleInfoBar from './HoleInfoBar'
import PlayerScoreList from './PlayerScoreList'
import gamesService from '../../services/gamesService'

const scoreInputViewTab = 0
const holeInfoViewTab = 1
const mapViewTab = 2
const gameInfoViewTab = 3

const buttonHeight = 110
const buttonEdgeMargin = 2
const buttonBottomMargin = 12

const parButtonWidth = 80
const parButtonHeight = 40

const useStyles = makeStyles((theme) => ({
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
  },
  progress: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  prevHole: {
    position: 'fixed',
    bottom: buttonBottomMargin + '%',
    left: buttonEdgeMargin + '%',
    height: buttonHeight,
    width: buttonHeight,
  },
  nextHole: {
    position: 'fixed',
    bottom: buttonBottomMargin + '%',
    right: buttonEdgeMargin + '%',
    height: buttonHeight,
    width: buttonHeight,
  },
  par: {
    margin: 'auto',
    position: 'fixed',
    left: window.innerWidth / 2 - parButtonWidth / 2, // Place it in the center.
    bottom: buttonBottomMargin + '%',
    width: parButtonWidth,
    height: parButtonHeight,
  }
}))

const ScoreInputPage: React.FC<{}> = (props: any) => {
  const classes = useStyles()
  const gameId = props.match.params.gameid // Props type as any to avoid props.match type problem.
  
  const [game, setGame] = useState()
  const [holeNum, setHoleNum] = useState(1) // TODO: Use findIndex() to start from first 0 stroked hole
  const [updating, setUpdating] = useState(false)
  const [tab, setTab] = React.useState(0)

  useEffect(() => {
    gamesService.getGame(gameId).then((fetchedGame) => {
      setGame(fetchedGame)
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

  if (game === undefined) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>
    )
  }

  const scoreInputView = (
    <div>
      <PlayerScoreList
        scores={game.scores}
        holeNumber={holeNum}
        onScoreChange={updateScores}
        updating={updating}
      />
      <Fab color="primary" aria-label="Add" className={classes.prevHole}>
        ◀
      </Fab>
      <Button variant="contained" size="medium" color="primary" className={classes.par}>
        Par
        </Button>
      <Fab color="primary" aria-label="Add" className={classes.nextHole}>
        ▶
      </Fab>
    </div>
  )

  let activeView
  switch (tab) {
    case scoreInputViewTab:
      activeView = scoreInputView
      break
    default:
      break
  }

  return (
    <div>
      <HoleInfoBar showInfo={tab !== gameInfoViewTab} />
      {activeView}
      <BottomNavigation
        value={tab}
        onChange={(event, newTab) => setTab(newTab)}
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
}

export default ScoreInputPage
