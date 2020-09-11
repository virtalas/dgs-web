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

const ScoreInputView: React.FC<Props> = (props) => {
  const { game, setGame, swipeableViewStyle, holeNum, setHoleNum, setTab } = props
  const [updating, setUpdating] = useState(false)

  const updateScores = (newScores: PlayerScores[]) => {
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

  // const handleParClick = () => {
  //   if (game === undefined) return
  //   const updatedScores: PlayerScores[] = game.scores
  //   updatedScores.forEach((playerScores: PlayerScores) => {
  //     playerScores.strokes[holeNum - 1] = game.course.pars[holeNum - 1]
  //   })
  //   updateScores(updatedScores)
  // }

  // Render hole navigation buttons for desktop.
  const holeNavigation = isMobile ? null : (
    <HoleNavigation
      holeNum={holeNum}
      showPar={false}
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
}

export default ScoreInputView
