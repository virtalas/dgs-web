import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import DescriptionIcon from '@material-ui/icons/Description'
import InfoIcon from '@material-ui/icons/Info'
import EditIcon from '@material-ui/icons/Edit'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import CircularProgress from '@material-ui/core/CircularProgress'

import HoleInfoBar from './HoleInfoBar'
import gamesService from '../../services/gamesService'
import ScoreInputView from './ScoreInputView'
import HoleInfoView from './HoleInfoView'
import GameInfoView from './GameInfoView'
import MapView from './MapView'

const scoreInputViewTab = 0
const holeInfoViewTab = 1
const mapViewTab = 2
export const gameInfoViewTab = 3

// TODO: change tab bar (& app bar) color to gameInputBlue
// TODO: SwipeableViews: When swiping starts, show big transparent grey hole number in the middle of the page. When swiping stops fade with animation after ~0.5 seconds.
// TODO Consider?: Group feature: When saving the game, choose which groups it belongs to

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
  const [availableWeatherConditions, setAvailableWeatherConditions] = useState<Condition[]>([])
  const [availableConditions, setAvailableConditions] = useState<Condition[]>([])
  const [holeNum, setHoleNum] = useState(1) // TODO: Use findIndex() to start from first 0 stroked hole
  const [tab, setTab] = React.useState(scoreInputViewTab)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    gamesService.getGame(gameId).then((fetchedGame) => {
      setGame(fetchedGame)
    })
    gamesService.getAvailableWeatherConditions().then(c => setAvailableWeatherConditions(c))
    gamesService.getAvailableConditions().then(c => setAvailableConditions(c))
  }, [gameId])

  const updateGame = (game: Game) => {
    console.log('update')
    if (game === undefined) return
    setUpdating(true)
    gamesService.updateGame(game).then(() => {
      setUpdating(false)
    })
    setGame(game)
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
    <ScoreInputView
      game={game}
      updateGame={updateGame}
      swipeableViewStyle={classes.swipeableView}
      holeNum={holeNum}
      setHoleNum={setHoleNum}
      setTab={setTab}
      updating={updating}
    />
  )

  const holeInfoView = (
    <HoleInfoView
      holeNum={holeNum}
      setHoleNum={setHoleNum}
      swipeableViewStyle={classes.swipeableView}
    />
  )

  // TODO
  const mapView = (
    <MapView mapURL={''} />
  )

  const gameInfoView = (
    <GameInfoView
      game={game}
      updateGame={updateGame}
      availableWeatherConditions={availableWeatherConditions}
      availableConditions={availableConditions}
      updating={updating}
    />
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
        <BottomNavigationAction label="Stats" icon={<InfoIcon />} />
        <BottomNavigationAction label="Map" icon={<LocationOnIcon />} />
        <BottomNavigationAction label="Game info" icon={<DescriptionIcon />} />
      </BottomNavigation>
    </div>
  )
}

export default GameInput
