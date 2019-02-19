
// for vertical scroll of scores: overflowX: 'auto'

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
})

function ScoreCard(props) {
  const { classes, game } = props

  const playerStrokes = (playerScores, index) => (
    <TableRow key={index}>
      <TableCell>{playerScores.firstName}</TableCell>
      {playerScores.strokes.map((strokeCount, index) => (
        <TableCell key={index}>{strokeCount}</TableCell>
      ))}
      <TableCell>{playerScores.total}</TableCell>
      <TableCell>{playerScores.toPar > 0 ? "+" + playerScores.toPar : playerScores.toPar}</TableCell>
    </TableRow>
  )

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{game.courseName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{game.endDate}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Hole</TableCell>
            {game.course.pars.map((par, index) => (
              <TableCell key={index}>{index + 1}</TableCell>
            ))}
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Par</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>PAR</TableCell>
            {game.course.pars.map((par, index) => (
              <TableCell key={index}>{par}</TableCell>
            ))}
            <TableCell>{game.course.total}</TableCell>
            <TableCell>0</TableCell>
          </TableRow>
          {game.scores.map((playerScores, index) => playerStrokes(playerScores, index))}
        </TableBody>
      </Table>
    </Paper>
  )
}

ScoreCard.propTypes = {
  classes: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
}

export default withStyles(styles)(ScoreCard)
