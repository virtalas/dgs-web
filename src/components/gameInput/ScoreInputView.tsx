import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { isMobile } from 'react-device-detect'

import { makeStyles } from '@material-ui/core/styles'
import HoleNavigation from './HoleNavigation'
import PlayerStrokeInput from './PlayerStrokeInput'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      marginLeft: '25%',
      marginRight: '25%',
    },
  },
}))

interface Props {
  game: Game,
  updateGame: (game: Game) => void, // Sends the game to backend.
  setGame: (game: Game) => void, // Sets the game locally.
  swipeableViewStyle: any,
  holeIndex: number,
  setHoleIndex: (index: number) => void,
  goToPreviewAndFinish: () => void,
  updating: boolean,
}

// TODO: Make column names: Player, To Par, OBs, Throws

const ScoreInputView: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { game, updateGame, setGame, swipeableViewStyle, holeIndex, setHoleIndex, goToPreviewAndFinish, updating } = props

  const updateScores = (newScores: PlayerScores[]) => {
    newScores = calculateToParTotal(newScores, game.layout.holes.map(hole => hole.par))
    const newGame = {
      ...game,
      scores: newScores,
    }
    setGame(newGame as Game)
  }

  const handlePrevHoleClick = () => {
    if (holeIndex > 0) {
      handleHoleChange(holeIndex - 1)
    }
  }

  const handleNextHoleClick = () => {
    if (game === undefined) return
    if (holeIndex === game.layout.holes.length - 1) {
      goToPreviewAndFinish()
    } else {
      handleHoleChange(holeIndex + 1)
    }
  }

  const handleHoleChange = (newHoleIndex: number) => {
    updateGame(game)
    setHoleIndex(newHoleIndex)
  }

  // Render hole navigation buttons for desktop.
  const holeNavigation = isMobile ? null : (
    <HoleNavigation
      onPrevHole={handlePrevHoleClick}
      onNextHole={handleNextHoleClick}
    />
  )

  return (
    <div id="scoresInputView" className={classes.root}>
      <SwipeableViews
        className={swipeableViewStyle}
        resistance
        index={holeIndex}
        onChangeIndex={(index: number) => handleHoleChange(index)}
      >
        {game.layout.holes.map((hole, index) => (
          <div key={index}>
            <PlayerStrokeInput
              scores={game.scores}
              holeNum={index + 1}
              coursePars={game.layout.holes.map(hole => hole.par)}
              onScoreChange={updateScores}
              goToPreviewAndFinish={goToPreviewAndFinish}
              updating={updating}
              key={index}
            />
          </div>
        ))}
      </SwipeableViews>

      {holeNavigation}
    </div>
  )
}

// Would be more efficient to just calculate from the inputted strokes in PlayerStrokeInput
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
