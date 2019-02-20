
// for vertical scroll of scores: overflowX: 'auto'

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import '../css/ScoreCardScrollable.css'
import '../css/ScoreCard.css'

const styles = theme => ({
  root: {
    // minWidth: '100%',
    maxWidth: 700,
    width: '100%',
    // margin: '0 auto',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'hidden',
    position: 'relative'
  },
})

function ScoreCard(props) {
  const { classes, game } = props

  const playerStrokes = (playerScores, index) => (
    <tr key={index}>
      <td className="stickyColumn">{playerScores.player.firstName}</td>
      {playerScores.strokes.map((strokeCount, index) => (
        <td className={classes.cell} key={index}>{strokeCount}</td>
      ))}
      <td>{playerScores.total}</td>
      <td>{playerScores.toPar > 0 ? "+" + playerScores.toPar : playerScores.toPar}</td>
    </tr>
  )

  const scoreTable = (
    <div className="scoreCardWrapper">
      <table className="scoreCard">
        <tbody>
          <tr>
            <td className="stickyColumn">Hole</td>
            {game.course.pars.map((par, index) => (
              <td key={index}>{index + 1}</td>
            ))}
            <td align="right">Total</td>
            <td align="right">Par</td>
          </tr>
          <tr>
            <td className="stickyColumn">PAR</td>
            {game.course.pars.map((par, index) => (
              <td key={index}>{par}</td>
            ))}
            <td>{game.course.total}</td>
            <td>0</td>
          </tr>
          {game.scores.map((playerScores, index) => playerStrokes(playerScores, index))}
        </tbody>
      </table>
    </div>
  )

  // const scrollableTable = (
  //   <div id="outerdiv">
  //       <div id="innerdiv">
  //           <table id="table1">
  //               <tr>
  //                   <td class="headcol">1</td>
  //                   <td class="long">DFGHJKLZXCVxxx</td>
  //                   <td class="long">DFGHJKLZXCV___</td>
  //                   <td class="headcol2">1</td>
  //               </tr>
  //               <tr>
  //                   <td class="headcol">2</td>
  //                   <td class="long">DFGHJKLZXCVxxx</td>
  //                   <td class="long">DFGHJKLZXCV___</td>
  //                   <td class="headcol2">1</td>
  //               </tr>
  //               <tr>
  //                   <td class="headcol">3</td>
  //                   <td class="long">DFGHJKLZXCVxxx</td>
  //                   <td class="long">DFGHJKLZXCV___</td>
  //                   <td class="headcol2">1</td>
  //               </tr>
  //           </table>
  //       </div>
  //   </div>
  // )

  const sideBySide = (
    <div className="wrap">
      <table className="left">
        <tr>
          <td>Hole</td>
        </tr>
        <tr>
          <td>PAR</td>
        </tr>
      </table>
      <div className="middle">
        <table>
          <tr><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
          <tr><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
        </table>
      </div>
      <table className="right">
        <tr>
          <td>Total</td>
          <td>Par</td>
        </tr>
        <tr>
          <td>60</td>
          <td>0</td>
        </tr>
      </table>
    </div>
  )

  return (
    <Paper className={classes.root}>
      <Typography variant="h6">{game.course.name}</Typography>
      <Typography variant="subtitle1">{game.endDate}</Typography>
      {sideBySide}
      <Typography align="left">Comment: {game.comment}</Typography>
    </Paper>
  )
}

ScoreCard.propTypes = {
  classes: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
}

export default withStyles(styles)(ScoreCard)
