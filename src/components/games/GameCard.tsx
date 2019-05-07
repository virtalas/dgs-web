import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'

import ScoreCard from './ScoreCard'
import GameInfo from './GameInfo'
import BlueCard from '../BlueCard'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'white',
  },
}))

interface Props {
  game: Game,
}

const GameCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game } = props

  // TODO: if startDate != null, render "1.1.1111 9.30 - 10.45"

  return (
    <BlueCard>
      <Typography variant="h6" className={classes.title}>{game.course.name}</Typography>
      <Typography variant="subtitle1" className={classes.title}>{game.endDate}</Typography>
      <ScoreCard game={game} />
      <GameInfo game={game} />
    </BlueCard>
  )
}

export default GameCard
