import React from 'react'
import { makeStyles } from '@material-ui/styles'

import HoleInfoBar from './HoleInfoBar'
import PlayerScoreList from './PlayerScoreList'

// Mock data:
// TODO: käytä Games.js mockdatan scores-kohtaa!
const scores = [
  {
    player: {
      id: 3,
      firstName: "Seppo",
    },
    strokes: [3,3,3,2,3,3,0,0,3,2,3,3,1,3,3,3,3,2,3,3],
    obs: [0,1,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    total: 49,
    toPar: 4
  },
  {
    player: {
      id: 3,
      firstName: "Teppo",
    },
    strokes: [3,3,4,2,3,3,3,3,3,2,3,6,3,3,2,3,3,2,2,2],
    obs: [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    total: 58,
    toPar: -2
  }
]

const useStyles = makeStyles((theme) => ({
  root: {
  },
}))

function ScoreInputPage() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <HoleInfoBar />
      <PlayerScoreList scores={scores} />
    </div>
  )
}

export default ScoreInputPage
