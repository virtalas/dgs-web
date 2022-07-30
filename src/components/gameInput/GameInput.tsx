import React, { useState, useEffect, useRef } from 'react'
import axios, { CancelTokenSource } from 'axios'
import { Redirect } from 'react-router'

import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import DescriptionIcon from '@material-ui/icons/Description'
import InfoIcon from '@material-ui/icons/Info'
import EditIcon from '@material-ui/icons/Edit'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Fade from '@material-ui/core/Fade'

import { useAuth } from '../../context/AuthContext'
import HoleInfoBar from './HoleInfoBar'
import gamesService from '../../services/gamesService'
import ScoreInputView from './ScoreInputView'
import HoleInfoView, { CourseHighScore } from './HoleInfoView'
import GameInfoView from './GameInfoView'
import MapView from './MapView'
import NotificationBar from '../NotificationBar'
import LoadingView from '../LoadingView'
import baseService from '../../services/baseService'
import weatherService from '../../services/weatherService'

const scoreInputViewTab = 0
const holeInfoViewTab = 1
const mapViewTab = 2
const gameInfoViewTab = 3

// TODO: change tab bar (& app bar) color to gameInputBlue
// TODO(?): SwipeableViews: When swiping starts, show big transparent grey hole number in the middle of the page. When swiping stops fade with animation after ~0.5 seconds.

const useStyles = makeStyles((theme) => ({
  swipeableView: {
    height: window.innerHeight,
  },
  bottomNav: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      marginRight: '25%',
      marginLeft: '25%',
    },
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
  const { userId } = useAuth()
  const gameId = props.match.params.gameid // Props type as any to avoid props.match type problem.

  const [game, setGame] = useState<Game>()
  const [availableWeatherConditions, setAvailableWeatherConditions] = useState<Tag[]>([])
  const [availableConditions, setAvailableConditions] = useState<Tag[]>([])
  const [holeIndex, setHoleIndex] = useState(0)
  const [tab, setTab] = React.useState(scoreInputViewTab)
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(false)
  const [gameLoadError, setGameLoadError] = useState(false)
  const [redirect, setRedirect] = useState(false)

  // Stats view
  const [highScores, setHighScores] = useState<CourseHighScore[]>()
  const [holeScoreDistribution, setHoleScoreDistribution] = useState<HoleScoreDistribution[]>()

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)
  const weatherCancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()

    gamesService.getGame(gameId, cancelTokenSourceRef.current).then((fetchedGame) => {
      setGame(fetchedGame)
      const firstZeroScoreHoleIndex = fetchedGame.scores[0].strokes.findIndex(score => score === 0)
      if (firstZeroScoreHoleIndex >= 0) {
        setHoleIndex(firstZeroScoreHoleIndex)
      }
    }).catch(e => setGameLoadError(true))
    
    gamesService.getAvailableConditions(cancelTokenSourceRef.current).then(conditions => {
      setAvailableConditions(conditions.filter(tag => tag.condition))
      setAvailableWeatherConditions(conditions.filter(tag => tag.weatherCondition))
    })

    return () => cancelTokenSourceRef.current?.cancel()
  }, [gameId])

  if (redirect) {
    return <Redirect to={'/'} />
  }

  if (game?.finished) {
    return (
      <Fade
        in={true}
        style={{
          transitionDelay: '2000ms',
        }}
        unmountOnExit
      >
        <div>
          This game has already finished. Try to edit it on the "games" page.
        </div>
      </Fade>
    )
  }

  if (game === undefined) {
    if (gameLoadError) {
      return (
        <div>Failed to load game. Check 1) your internet 2) is the URL correct 3) does this game even exist?</div>
      )
    }
    return (
      <LoadingView />
    )
  }

  const updateGame = (game: Game, finished?: boolean) => {
    if (game === undefined) return
    setUpdating(true)
    setUpdateError(false)

    // Cancel requests if they don't finish before the hole is changed again (user flicking through quikcly).
    cancelTokenSourceRef.current?.cancel()
    cancelTokenSourceRef.current = baseService.cancelTokenSource()


    gamesService.updateGame(game, userId, cancelTokenSourceRef.current)
      .then(() => {
        setUpdating(false)
        if (finished !== undefined && finished) {
          setRedirect(true)
        }
      }).catch(error => {
        setUpdating(false)
        if (!axios.isCancel(error)) {
          setUpdateError(true)
        }
      })

    setGame(game)
  }

  const checkGameLegalities = () => {
    if (game === undefined) return
    const illegalScorers: Player[] = []

    game.scores.forEach((playerScores: PlayerScores) => {
      if (playerScores.strokes.includes(0)) {
        illegalScorers.push(playerScores.player)
      }
    })
    
    game.illegalScorers = illegalScorers
    setGame(game)
  }

  const updateGameWeatherConditions = () => {
    if (game === undefined) return
    weatherCancelTokenSourceRef.current = baseService.cancelTokenSource()
    weatherService.getLocalWeather(game.courseId, weatherCancelTokenSourceRef.current)
      .then(localWeather => {
        if (game === undefined) return
        console.log('Setting weather information with', localWeather)

        if (localWeather.rain) {
          game.weatherConditions = addTagIfExists('rain', game.weatherConditions, availableWeatherConditions)
        }
        if (localWeather.snow) {
          game.weatherConditions = addTagIfExists('snow', game.weatherConditions, availableWeatherConditions)
        }
        if (new Date().getTime() > new Date(localWeather.sunsetTime * 1000).getTime()) {
          game.weatherConditions = addTagIfExists('dark', game.weatherConditions, availableWeatherConditions)
        }
        if (localWeather.windSpeed > 4) {
          game.weatherConditions = addTagIfExists('windy', game.weatherConditions, availableWeatherConditions)
        }
        game.temperature = localWeather.temperature
        game.weatherIconId = localWeather.iconId
        setGame({...game})
      })
      .catch(e => console.log('Failed to fetch weather: ' + e))
  }

  const handleGoToPreviewAndFinish = () => {
    setTab(gameInfoViewTab)
    checkGameLegalities()
    updateGameWeatherConditions()
  }

  const handleFinish = () => {
    if (!game) return
    game.finished = true
    updateGame(game, true)
  }

  const holeNumFor = (index: number): number => {
    if (index < 0 || index >= (game?.layout.holes.length ?? 0)) return -1
    return game?.layout.holes[index].number ?? -1
  }

  const scoreInputView = (
    <ScoreInputView
      game={game}
      updateGame={updateGame}
      setGame={setGame}
      swipeableViewStyle={classes.swipeableView}
      holeIndex={holeIndex}
      setHoleIndex={setHoleIndex}
      goToPreviewAndFinish={handleGoToPreviewAndFinish}
      updating={updating}
    />
  )

  const holeInfoView = (
    <HoleInfoView
      holeIndex={holeIndex}
      setHoleIndex={setHoleIndex}
      swipeableViewStyle={classes.swipeableView}
      game={game}
      layout={game.layout}
      highScores={highScores}
      setHighScores={setHighScores}
      holeScoreDistribution={holeScoreDistribution}
      setHoleScoreDistribution={setHoleScoreDistribution}
    />
  )

  const mapView = (
    <MapView mapURL={game ? game.layout.mapURL : ''} />
  )

  const gameInfoView = (
    <GameInfoView
      game={game}
      updateGame={updateGame}
      handleFinish={handleFinish}
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
    <div id="gameInputPage">
      <HoleInfoBar
        showInfo={tab !== gameInfoViewTab}
        holeNum={holeNumFor(holeIndex)}
        game={game}
        par={game?.layout.holes[holeIndex].par ?? -1}
      />
      
      {activeView}

      <NotificationBar
        open={updateError}
        severity="error"
        msg="An error occured while updating the game."
        onClose={() => setUpdateError(false)}
      />

      <div className={classes.bottomNav}>
        <BottomNavigation
          value={tab}
          onChange={(event, newTab) => setTab(newTab)}
          showLabels
        >
          <BottomNavigationAction label="Scores" icon={<EditIcon />} id="scoresTabButton" />
          <BottomNavigationAction label="Stats" icon={<InfoIcon />} id="statsTabButton" />
          <BottomNavigationAction label="Map" icon={<LocationOnIcon />} id="mapTabButton" />
          <BottomNavigationAction label="Game info" icon={<DescriptionIcon id="gameInfoTabButton" />} />
        </BottomNavigation>
      </div>
    </div>
  )
}

function addTagIfExists(tagName: string, tags: Tag[], availableTags: Tag[]): Tag[] {
  const tag = availableTags.find(t => t.name === tagName)
  if (!tag) {
    return tags
  } else {
    return [tag, ...tags]
  }
}

export default GameInput
