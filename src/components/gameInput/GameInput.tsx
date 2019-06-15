import React, { useState, useEffect } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { isMobile } from 'react-device-detect'

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

export const gameInputBlue = '#437FB3'

const scoreInputViewTab = 0
const holeInfoViewTab = 1
const mapViewTab = 2
const gameInfoViewTab = 3

// TODO: change tab bar color to gameInputBlue
// TODO: SwipeableViews: When swiping starts, show big transparent grey hole number in the middle of the page. When swiping stops fade with animation after ~0.5 seconds.

const useStyles = makeStyles((theme) => ({
  swipeableView: {
    height: window.innerHeight,
  },
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
  
  const [game, setGame] = useState<Game>()
  const [holeNum, setHoleNum] = useState(1) // TODO: Use findIndex() to start from first 0 stroked hole
  const [updating, setUpdating] = useState(false)
  const [tab, setTab] = React.useState(scoreInputViewTab)

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
    setGame(newGame as Game)
  }

  const handleHoleChange = () => {
    if (game === undefined) return
    // TODO: Call updateGame only if 1 second has passed since last update
    setUpdating(true)
    gamesService.updateGame(game as Game).then(() => {
      setUpdating(false)
    })
  }

  const handlePrevHoleClick = () => {
    if (holeNum > 1) {
      setHoleNum(holeNum - 1)
      handleHoleChange()
    }
  }

  const handleNextHoleClick = () => {
    if (game === undefined) return
    if (holeNum === game.course.pars.length) {
      setTab(gameInfoViewTab)
    } else {
      setHoleNum(holeNum + 1)
    }
    handleHoleChange()
  }

  const handleParClick = () => {
    if (game === undefined) return
    const updatedScores: PlayerScores[] = game.scores
    updatedScores.forEach((playerScores: PlayerScores) => {
      playerScores.strokes[holeNum - 1] = game.course.pars[holeNum - 1]
    })
    updateScores(updatedScores)
  }

  // Show loading screen while fetching game:
  if (game === undefined) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
      </div>
    )
  }

  // Render hole navigation buttons for desktop.
  const holeNavigation = isMobile ? null : (
    <HoleNavigation
      holeNum={holeNum}
      showPar={false}
      onPrevHole={handlePrevHoleClick}
      onNextHole={handleNextHoleClick}
    />
  )

  const scoreInputView = (
    <div>
      <SwipeableViews
        className={classes.swipeableView}
        resistance
        onChangeIndex={(index: number) => setHoleNum(index + 1)}
      >
        {game.course.pars.map((par, index) => (
          <PlayerStrokeInput
            scores={game.scores}
            holeNumber={index + 1}
            onScoreChange={updateScores}
            updating={updating}
            key={index}
          />
        ))}
      </SwipeableViews>
      {holeNavigation}
    </div>
  )

  // TODO: Use SwipeableViews
  const holeInfoView = (
    <div>
      <SwipeableViews
        className={classes.swipeableView}
        resistance
        onChangeIndex={(index: number) => setHoleNum(index + 1)}
      >
        <div>Coming soon</div>
      </SwipeableViews>
      {holeNavigation}
    </div>
  )

  // TODO
  const mapView = (
    <div>
      <br /><br /><br /><br /><br />No course map added.
    </div>
  )

  // TODO
  const gameInfoView = (
    <div>
      <br /><br /><br /><br /><br />(Preview of game card)<br />[Send game]
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
      activeView = mapView
      break
    case gameInfoViewTab:
      activeView = gameInfoView
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
