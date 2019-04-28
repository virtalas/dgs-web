import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

import ScoreCard from './ScoreCard'
import GameInfo from './GameInfo'
import BlueCard from '../BlueCard'

const styles = theme => ({
  title: {
    color: 'white',
  },
})

function GameCard(props) {
  const { classes, game } = props

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

GameCard.propTypes = {
  classes: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
}

export default withStyles(styles)(GameCard)
