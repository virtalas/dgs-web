import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'

import HoleInfoBar from './HoleInfoBar'
import PlayerScoreList from './PlayerScoreList'

// Mock data:
const gameMock: Game = {
  id: "123sdfsdf",
  course: {
    id: "fds3ury83ofh",
    name: "Puolarmaari",
    pars: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3],
    total: 60,
  },
  startDate: null,
  endDate: "2019-02-16 09:22",
  scores: [
    {
      player: {
        id: "jf8pf8spö3",
        firstName: "Seppo",
      },
      strokes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 0,
      toPar: 0
    },
    {
      player: {
        id: "fh83p98slhs",
        firstName: "Teppo",
      },
      strokes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      obs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      total: 0,
      toPar: 0
    }
  ],
  temperature: null,
  weatherConditions: [],
  conditions: [],
  highScorers: [],
  illegalScorers: [],
  comment: null,
  contestName: null,
}

const useStyles = makeStyles((theme) => ({
  root: {
  },
}))

interface Props {}

const ScoreInputPage: React.FC<Props> = () => {
  const classes = useStyles()

  // TODO
  // Create a new game by POST.
  // Returns an empty game with scores.
  // OR fetch the game to continue inputting scores.
  const [game, setGame] = useState(gameMock)
  const [holeNum, setHoleNum] = useState(1) // Always start from hole one.

  const updateScores = (newScores: PlayerScores[]) => {
    setGame({
      ...game,
      scores: newScores,
    })
  }

  return (
    <div className={classes.root}>
      <HoleInfoBar />
      <PlayerScoreList scores={game.scores} holeNumber={holeNum} onScoreChange={updateScores} />
      {/* Bottom navigation component (scores, hole info, map, game) */}
    </div>
  )
}

export default ScoreInputPage
