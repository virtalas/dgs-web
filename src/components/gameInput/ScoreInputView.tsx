import React, { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { isMobile } from 'react-device-detect'

import HoleNavigation from './HoleNavigation'
import PlayerStrokeInput from './PlayerStrokeInput'
import gamesService from '../../services/gamesService'
import { gameInfoViewTab } from './GameInput'

interface Props {
  game: Game,
  setGame: (game: Game) => void,
  swipeableViewStyle: any,
  holeNum: number,
  setHoleNum: (holeNum: number) => void,
  setTab: (tab: number) => void,
}

// TODO: Make column names: Player, To Par, OBs, Throws

const ScoreInputView: React.FC<Props> = (props) => {
  const { game, setGame, swipeableViewStyle, holeNum, setHoleNum, setTab } = props
  const [updating, setUpdating] = useState(false)

  const updateScores = (newScores: PlayerScores[]) => {
    newScores = calculateToParTotal(newScores, game.course.pars)
    const newGame = {
      ...game,
      scores: newScores,
    }
    setGame(newGame as Game)
    updateGame()
  }

  const updateGame = () => {
    if (game === undefined) return
    setUpdating(true)
    gamesService.updateGame(game as Game).then(() => {
      setUpdating(false)
    })
  }

  const handlePrevHoleClick = () => {
    if (holeNum > 1) {
      setHoleNum(holeNum - 1)
    }
  }

  const handleNextHoleClick = () => {
    if (game === undefined) return
    if (holeNum === game.course.pars.length) {
      setTab(gameInfoViewTab)
    } else {
      setHoleNum(holeNum + 1)
    }
  }

  // Render hole navigation buttons for desktop.
  const holeNavigation = isMobile ? null : (
    <HoleNavigation
      holeNum={holeNum}
      showPar={true}
      onPrevHole={handlePrevHoleClick}
      onNextHole={handleNextHoleClick}
    />
  )

  return (
    <div>
      <SwipeableViews
        className={swipeableViewStyle}
        resistance
        index={holeNum - 1}
        onChangeIndex={(index: number) => setHoleNum(index + 1)}
      >
        {game.course.pars.map((par, index) => (
          <div key={index}>
            <PlayerStrokeInput
              scores={game.scores}
              holeNum={index + 1}
              coursePars={game.course.pars}
              onScoreChange={updateScores}
              setTab={setTab}
              updating={updating}
              key={index}
            />
            {/*
            <Button
              variant="outlined"
              size="medium"
              color="default"
              className={classes.par}
              onClick={handleParClick}
              key={'par' + index}
            >
              Par
            </Button>
            */}
          </div>
        ))}
      </SwipeableViews>
      {holeNavigation}
    </div>
  )
}

// TODO: !!! Would be more efficient to just calculate from the inputted strokes in PlayerStrokeInput
function calculateToParTotal(playerScores: PlayerScores[], coursePars: number[]): PlayerScores[] {
  playerScores.forEach((scores, index, array) => {
    let toPar = 0
    let total = 0
    for (var i = 0; i < coursePars.length; i++) {
      if (scores.strokes[i] === 0) continue
      total += scores.strokes[i] + scores.obs[i]
      toPar += scores.strokes[i] + scores.obs[i] - coursePars[i]
    }
    array[index].toPar = toPar
    array[index].total = total
  })
  return playerScores
}

export default ScoreInputView
