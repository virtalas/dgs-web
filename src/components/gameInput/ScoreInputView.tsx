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
  updateGame: (game: Game) => void,
  swipeableViewStyle: any,
  holeNum: number,
  setHoleNum: (holeNum: number) => void,
  goToPreviewAndFinish: () => void,
  updating: boolean,
}

// TODO: Make column names: Player, To Par, OBs, Throws

const ScoreInputView: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { game, updateGame, swipeableViewStyle, holeNum, setHoleNum, goToPreviewAndFinish, updating } = props

  const updateScores = (newScores: PlayerScores[]) => {
    newScores = calculateToParTotal(newScores, game.layout.holes.map(hole => hole.par))
    const newGame = {
      ...game,
      scores: newScores,
    }
    updateGame(newGame as Game)
  }

  const handlePrevHoleClick = () => {
    if (holeNum > 1) {
      setHoleNum(holeNum - 1)
    }
  }

  const handleNextHoleClick = () => {
    if (game === undefined) return
    if (holeNum === game.layout.holes.length) { // TODO: handle edited hole numbers, get holeNum from Hole.number
      goToPreviewAndFinish()
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
    <div id="scoresInputView" className={classes.root}>
      <SwipeableViews
        className={swipeableViewStyle}
        resistance
        index={holeNum - 1}
        onChangeIndex={(index: number) => setHoleNum(index + 1)}
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
