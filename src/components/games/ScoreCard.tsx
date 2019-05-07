import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles((theme) => ({
  rootPaper: {
    marginBottom: 10,
  },
  /*
    Positioning.
    Flex to make the middle table horizontally scrollable.
  */
  mainWrapper: {
    display: 'flex',
    flexWrap: 'nowrap',
    padding: 2,
    '& td': {
      border: '1px solid #000000',
      height: 26,
      fontWeight: 'lighter',
      overflow: 'hidden', /* Stop ob stroke markers from bleeding outside cells. */
    },
    '& table': {
      borderCollapse: 'collapse',
    }
  },
  leftTable: {
    flex: '0 0 60px',
    zIndex: 1, /* Have the middle table 'slide under' the side tables. */
    marginRight: -1, /* Have the name column border over the middle table while scrolling. */
    '& td': {
      borderLeft: 0,
      /* Also pushes par column to the edge in Safari: */
      paddingRight: 8,
      paddingLeft: 5,
    }
  },
  middleContainer: {
    flex: '0 1 700px',
    overflow: 'scroll',
    zIndex: 0, /* Have the middle table 'slide under' the side tables. */
    marginBottom: -15, /* Get rid of extra space under the middle table. */
    '& table': {
      width: '100%',
      '& td': {
        minWidth: 26,
      }
    },
    '&::-webkit-scrollbar': {
      width: 0,  /* Remove scrollbar space. */
      height: 0,
    },
  },
  rightTable: {
    flex: '0 0 40px',
    minWidth: 40, /* for Safari */
    zIndex: 1, /* Have the middle table 'slide under' the side tables. */
    marginLeft: -1, /* Have the par column border over the middle table while scrolling, while not having double width border between middle & right tables. */
    '& td': {
      borderRight: 0,
    }
  },
  /*
    Cell specific fixes.
  */
  totalCell: {
    paddingLeft: 2,
    paddingRight: 3,
  },
  /*
    Row specific fixes.
  */
  topRow: {
    '& td': {
      borderTop: 0,
    }
  },
  bottomRow: {
    '& td': {
      borderBottom: 0,
    }
  },
  /*
    Score colors.
  */
  holeInOne: {
    backgroundColor: '#F75151',
  },
  eagle: {
    backgroundColor: '#FFFF00',
  },
  birdie: {
    backgroundColor: '#00F700',
  },
  par: {
    backgroundColor: '#A7C942',
  },
  bogey: {
    backgroundColor: '#FFA500',
  },
  overBogey: {
    backgroundColor: '#A37BA3',
  },
  /*
    OB marker.
  */
  ob: {
    height: 5,
    width: 5,
    backgroundColor: 'black',
    borderRadius: '50%',
    display: 'inline-block',
    verticalAlign: 'top',
    marginRight: 1,
    marginLeft: 1,
  },
  obWrapper: {
    position: 'absolute',
    top: -3, /* -3 perfect for Safari */
    left: 0,
    width: '100%',
  },
  obContainer: {
    position: 'relative',
    textAlign: 'left',
    marginLeft: 1,
  },
  /* Style for displaying ob as eg 3+1: */
  obCount: {
    fontSize: '80%',
  },
}))

interface Props {
  game: Game,
}

const ScoreCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game } = props

  const holeNumbers = game.course.pars.map((par: number, index: number) => (
    <td key={index}>{index + 1}</td>
  ))

  const coursePars = game.course.pars.map((par: number, index: number) => (
    <td key={index}>{par}</td>
  ))

  const playerNames = game.scores.map((playerScores, index) => (
    <tr className={index + 1 === game.scores.length ? classes.bottomRow : ""} key={index}>
      <td align="left">
        {playerScores.player.firstName}
      </td>
    </tr>
  ))

  const createObMarkers = (obStrokes: number) => {
    const markers = []
    // Render max three ob markers
    for (let i = 0; i < Math.min(obStrokes, 3); i += 1) {
      markers.push(
        <span className={classes.ob} key={i} />
      )
    }
    return (
      <div className={classes.obContainer}>
        <div className={classes.obWrapper}>
          {markers}
        </div>
      </div>
    )
  }

  const playerStrokes = (playerScores: PlayerScores, index: number) => (
    <tr className={classes.bottomRow} key={index}>
      {playerScores.strokes.map((strokeCount: number, index: number) => {
        const holePar = game.course.pars[index]
        const obStrokes = playerScores.obs[index]
        let scoreClass

        switch (strokeCount) {
          case 0:
            scoreClass = ""
            break;
          case 1:
            scoreClass = classes.holeInOne
            break;
          case holePar - obStrokes - 2:
            scoreClass = classes.eagle
            break;
          case holePar - obStrokes - 1:
            scoreClass = classes.birdie
            break;
          case holePar - obStrokes:
            scoreClass = classes.par
            break;
          case holePar - obStrokes + 1:
            scoreClass = classes.bogey
            break;
          default:
            scoreClass = classes.overBogey
        }

        return (
          <td className={scoreClass} key={index}>
            {strokeCount === 0 ? "-" : strokeCount}
            {/* obStrokes ? (<span className="obCount">{"+" + obStrokes}</span>) : null */}
            {obStrokes > 0 ? createObMarkers(obStrokes) : null}
          </td>
        )
      })}
      <td>{playerScores.total}</td>
    </tr>
  )

  const playerToPars = game.scores.map((playerScores, index) => (
    <tr className={classes.bottomRow} key={index}>
      <td>{playerScores.toPar > 0 ? "+" + playerScores.toPar : playerScores.toPar}</td>
    </tr>
  ))

  const scoreTable = (
    <div className={classes.mainWrapper}>
      <table className={classes.leftTable}>
        <tbody>
          <tr className={classes.topRow}>
            <td align="left">Hole</td>
          </tr>
          <tr>
            <td align="left">PAR</td>
          </tr>
          {playerNames}
        </tbody>
      </table>
      <div className={classes.middleContainer}>
        <table>
          <tbody>
            <tr className={classes.topRow}>
              {holeNumbers}
              <td className={classes.totalCell}>Total</td>
            </tr>
            <tr>
              {coursePars}
              <td>{game.course.total}</td>
            </tr>
            {game.scores.map((playerScores, index) => playerStrokes(playerScores, index))}
          </tbody>
        </table>
      </div>
      <table className={classes.rightTable}>
        <tbody>
          <tr className={classes.topRow}>
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
    <Paper className={classes.rootPaper}>
      {scoreTable}
    </Paper>
  )
}

export default ScoreCard