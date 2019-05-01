import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'

import '../../css/ScoreCard.css'

const useStyles = makeStyles((theme) => ({
  rootPaper: {
    marginBottom: 10,
  },
}))

interface Props {
  game: Game,
}

const ScoreCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game } = props

  const holeNumbers = game.course.pars.map((par: number, index: number) => (
    <td className="topCell" key={index}>{index + 1}</td>
  ))

  const coursePars = game.course.pars.map((par: number, index: number) => (
    <td key={index}>{par}</td>
  ))

  const playerNames = game.scores.map((playerScores, index) => (
    <tr key={index}>
      <td align="left" className={index + 1 === game.scores.length ? "bottomCell" : ""}>
        {playerScores.player.firstName}
      </td>
    </tr>
  ))

  const createObMarkers = (obStrokes: number) => {
    const markers = []
    // Render max three ob markers
    for (let i = 0; i < Math.min(obStrokes, 3); i += 1) {
      markers.push(
        <span className="ob" key={i} />
      )
    }
    return (
      <div className="obContainer">
        <div className="obWrapper">
          {markers}
        </div>
      </div>
    )
  }

  const playerStrokes = (playerScores: PlayerScores, index: number) => (
    <tr key={index}>
      {playerScores.strokes.map((strokeCount: number, index: number) => {
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
              <td className="topCell totalCell">Total</td>
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

  return (
    <Paper className={classes.rootPaper}>
      {scoreTable}
    </Paper>
  )
}

export default ScoreCard
