import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import Chip from '@material-ui/core/Chip'

import '../css/ScoreCard.css'

// Card constants
const horizontalMargin = 1 // vw amount of margin/space from the sides of the screen
const maxMobileCardWidth = window.innerWidth - 0.01 * horizontalMargin * 2 * window.innerWidth
const maxDesktopCardWidth = 700

// Card content constants
const contentHorizontalMargin = 2 // vw amount of margin/space from the sides of the card
const maxMobileContentWidth = maxMobileCardWidth - 0.01 * contentHorizontalMargin * 2 * maxMobileCardWidth
const maxDesktopContentWidth = maxDesktopCardWidth - 0.01 * contentHorizontalMargin * 2 * maxDesktopCardWidth

const styles = theme => ({
  card: {
    maxWidth: Math.min(maxMobileCardWidth, maxDesktopCardWidth),
    width: '100%',
    marginTop: theme.spacing.unit * 4,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing.unit * 4,
    overflowX: 'hidden',
    backgroundColor: '#3087C1',
  },
  title: {
    color: 'white',
  },
  content: {
    maxWidth: Math.min(maxMobileContentWidth, maxDesktopContentWidth),
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  scoreTablePaper: {
    marginBottom: 10,
  },
  infoPaper: {
    marginBottom: 10,
    padding: 6,
    textAlign: 'left',
  },
  chip: {
    height: 22,
    marginRight: 5,
  },
  chipTag: {
    height: 22,
    width: "100%",
    fontSize: '97%',
    cursor: 'pointer',
    // backgroundColor:
  },
  comment: {
    marginTop: 5,
  },
})

function handleClick() {
  // TODO: Direct to player's page
  alert('You clicked the Chip.')
}

function ScoreCard(props) {
  const { classes, game } = props

  const holeNumbers = game.course.pars.map((par, index) => (
    <td className="topCell" key={index}>{index + 1}</td>
  ))

  const coursePars = game.course.pars.map((par, index) => (
    <td key={index}>{par}</td>
  ))

  const playerNames = game.scores.map((playerScores, index) => (
    <tr key={index}>
      <td align="left" className={index + 1 === game.scores.length ? "bottomCell" : ""}>
        {playerScores.player.firstName}
      </td>
    </tr>
  ))

  const createObMarkers = (obStrokes) => {
    const markers = []
    for (let i = 0; i < obStrokes; i += 1) {
      markers.push(
        <span className="ob" key={i} />
      )
    }
    return (<div className="obContainer"><div className="obWrapper">{markers}</div></div>)
  }

  const playerStrokes = (playerScores, index) => (
    <tr key={index}>
      {playerScores.strokes.map((strokeCount, index) => {
        const holePar = game.course.pars[index]
        const obStrokes = playerScores.obs[index]
        let scoreClass

        switch (strokeCount) {
          case 0:
            scoreClass = ""
            break;
          case 1:
            scoreClass = "holeInOne"
            break;
          case holePar - obStrokes - 2:
            scoreClass = "eagle"
            break;
          case holePar - obStrokes - 1:
            scoreClass = "birdie"
            break;
          case holePar - obStrokes:
            scoreClass = "par"
            break;
          case holePar - obStrokes + 1:
            scoreClass = "bogey"
            break;
          default:
            scoreClass = "overBogey"
        }

        return (
          <td className={scoreClass + " bottomCell"} key={index}>
            {strokeCount === 0 ? "-" : strokeCount}
            {/* obStrokes ? (<span className="obCount">{"+" + obStrokes}</span>) : null */}
            {obStrokes > 0 ? createObMarkers(obStrokes) : null}
          </td>
        )
      })}
      <td className="bottomCell">{playerScores.total}</td>
    </tr>
  )

  const playerToPars = game.scores.map((playerScores, index) => (
    <tr key={index}>
      <td className="bottomCell">{playerScores.toPar > 0 ? "+" + playerScores.toPar : playerScores.toPar}</td>
    </tr>
  ))

  const scoreTable = (
    <div className="wrap">
      <table className="left">
        <tbody>
          <tr>
            <td align="left" className="topCell">Hole</td>
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
              <td className="topCell">Total</td>
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
            <td className="topCell">Par</td>
          </tr>
          <tr>
            <td>0</td>
          </tr>
          {playerToPars}
        </tbody>
      </table>
    </div>
  )

  const conditions = (
    <div className="chipRow">
      {game.temperature ? <Chip className={classes.chip} label={game.temperature + "°C"} /> : null}
      {game.weatherConditions.map((condition, index) => (
        <Chip className={classes.chip} label={condition} key={index} />
      ))}
      {game.conditions.map((condition, index) => (
        <Chip className={classes.chip} label={condition} key={index} />
      ))}
    </div>
  )

  const illegalAndHighScorers = (
    <div className="chipRow">
      {game.highScorers.map((name, index) => (
        <Chip
          classes={{ avatar: classes.chipTag }}
          avatar={<Chip label="High score" />}
          label={name}
          variant="outlined"
          color="primary"
          onClick={handleClick}
          className={classes.chip}
          key={index} />
      ))}
      {game.illegalScorers.map((name, index) => (
        <Chip
          classes={{ avatar: classes.chipTag }}
          avatar={<Chip label="Illegal game" />}
          label={name}
          variant="outlined"
          color="secondary"
          onClick={handleClick}
          className={classes.chip}
          key={index} />
      ))}
    </div>
  )

  const shouldShowInfoPaper = game.temperature || game.weatherConditions.length || game.conditions.length ||
                              game.highScorers.length || game.illegalScorers.length || game.comment || game.contestName

  return (
    <Card className={classes.card}>
      <div className={classes.content}>
        <Typography variant="h6" className={classes.title}>{game.course.name}</Typography>
        <Typography variant="subtitle1" className={classes.title}>{game.endDate}</Typography>
        <Paper className={classes.scoreTablePaper}>
          {scoreTable}
        </Paper>
        {shouldShowInfoPaper ? (
          <Paper className={classes.infoPaper}>
            {conditions}
            {illegalAndHighScorers}
            <Typography className={classes.comment} align="left" variant="body1">{game.comment}</Typography>
          </Paper>
        ) : null}
      </div>
    </Card>
  )
}

ScoreCard.propTypes = {
  classes: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
}

export default withStyles(styles)(ScoreCard)
