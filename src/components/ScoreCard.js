import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import '../css/ScoreCard.css'

const horizontalMargin = 1 // vw
const maxMobileWidth = window.innerWidth - 0.01 * horizontalMargin * 2 * window.innerWidth
const maxDesktopWidth = 700

const styles = theme => ({
  root: {
    maxWidth: Math.min(maxMobileWidth, maxDesktopWidth),
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: 'auto',
    marginRight: 'auto',
    overflowX: 'hidden',
  },
})

function ScoreCard(props) {
  const { classes, game } = props

  const holeNumbers = game.course.pars.map((par, index) => (
    <td key={index}>{index + 1}</td>
  ))

  const coursePars = game.course.pars.map((par, index) => (
    <td key={index}>{par}</td>
  ))

  const playerNames = game.scores.map((playerScores, index) => (
    <tr key={index}>
      <td align="left">{playerScores.player.firstName}</td>
    </tr>
  ))

  const playerStrokes = (playerScores, index) => (
    <tr key={index}>
      {playerScores.strokes.map((strokeCount, index) => (
        <td className={classes.cell} key={index}>{strokeCount}</td>
      ))}
      <td>{playerScores.total}</td>
    </tr>
  )

  const playerToPars = game.scores.map((playerScores, index) => (
    <tr key={index}>
      <td>{playerScores.toPar > 0 ? "+" + playerScores.toPar : playerScores.toPar}</td>
    </tr>
  ))

  const scoreTable = (
    <div className="wrap">
      <table className="left">
        <tbody>
          <tr>
            <td align="left">Hole</td>
          </tr>
          <tr>
            <td align="left">PAR</td>
          </tr>
          {playerNames}
        </tbody>
      </table>
      <div className="middle">
        <table>
          <tbody>
            <tr>
              {holeNumbers}
              <td>Total</td>
            </tr>
            <tr>
              {coursePars}
              <td>{game.course.total}</td>
            </tr>
            {game.scores.map((playerScores, index) => playerStrokes(playerScores, index))}
          </tbody>
        </table>
      </div>
      <table className="right">
        <tbody>
          <tr>
            <td>Par</td>
          </tr>
          <tr>
            <td>0</td>
          </tr>
          {playerToPars}
        </tbody>
      </table>
    </div>
  )

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">{game.course.name}</Typography>
      <Typography variant="subtitle1">{game.endDate}</Typography>
      {scoreTable}
      <Typography align="left">Comment: {game.comment}</Typography>
    </Paper>
  )
}

ScoreCard.propTypes = {
  classes: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
}

export default withStyles(styles)(ScoreCard)
