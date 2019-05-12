import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import DescriptionIcon from '@material-ui/icons/Description'
import InfoIcon from '@material-ui/icons/Info'
import EditIcon from '@material-ui/icons/Edit'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import CircularProgress from '@material-ui/core/CircularProgress'

import HoleInfoBar from './HoleInfoBar'
import HoleNavigation from './HoleNavigation'
import PlayerStrokeInput from './PlayerStrokeInput'
import gamesService from '../../services/gamesService'

const scoreInputViewTab = 0
const holeInfoViewTab = 1
const mapViewTab = 2
const gameInfoViewTab = 3

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
}))

const GameInput: React.FC<{}> = (props: any) => {
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

  const handlePrevHole = () => {
    if (holeNum > 1) {
      setHoleNum(holeNum - 1)
      handleHoleChange()
    }
  }

  const handleNextHole = () => {
    if (holeNum === game.course.pars.length) {
      setTab(gameInfoViewTab)
    } else {
      setHoleNum(holeNum + 1)
    }
    handleHoleChange()
  }

  // Show loading screen while fetching game:
  if (game === undefined) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>
    )
  }

  const scoreInputView = (
    <div>
      <PlayerStrokeInput
        scores={game.scores}
        holeNumber={holeNum}
        onScoreChange={updateScores}
        updating={updating}
      />
      <HoleNavigation
        holeNum={holeNum}
        showPar={true}
        onPrevHole={handlePrevHole}
        onNextHole={handleNextHole}
      />
    </div>
  )

  const holeInfoView = (
    <div>
      <HoleNavigation
        holeNum={holeNum}
        showPar={true}
        onPrevHole={handlePrevHole}
        onNextHole={handleNextHole}
      />
    </div>
  )

  let activeView
  switch (tab) {
    case scoreInputViewTab:
      activeView = scoreInputView
      break
    case holeInfoViewTab:
      activeView = holeInfoView
      break
    case mapViewTab:
      // TODO
      break
    default:
      break
  }

  return (
    <div>
      <HoleInfoBar
        showInfo={tab !== gameInfoViewTab}
        holeNum={holeNum}
        par={game.course.pars[holeNum - 1]}
      />
      {activeView}
      <BottomNavigation
        value={tab}
        onChange={(event, newTab) => setTab(newTab)}
        showLabels
        className={classes.bottomNav}
      >
        <BottomNavigationAction label="Scores" icon={<EditIcon />} />
        <BottomNavigationAction label="Hole info" icon={<InfoIcon />} />
        <BottomNavigationAction label="Map" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Game info" icon={<DescriptionIcon />} />
      </BottomNavigation>
    </div>
  )
}

export default GameInput
