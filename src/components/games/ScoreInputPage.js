import React from 'react'
import { makeStyles } from '@material-ui/styles'

import HoleInfoBar from './HoleInfoBar'
import PlayerScoreList from './PlayerScoreList'

// Mock data:
// TODO: käytä Games.js mockdatan scores-kohtaa!
const players1 = ['Teppo', 'Seppo', 'Matti']
const players2 = ['Teppo', 'Seppo', 'Matti', 'Heikki', 'Toljanteri', 'Kaapo', 'Ilmari', 'Teppo', 'Seppo', 'Matti', 'Heikki', 'Toljanteri', 'Kaapo', 'Ilmari']

const useStyles = makeStyles((theme) => ({
  root: {
  },
}))

function ScoreInputPage() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <HoleInfoBar />
      <PlayerScoreList players={players2} />
    </div>
  )
}

export default ScoreInputPage
