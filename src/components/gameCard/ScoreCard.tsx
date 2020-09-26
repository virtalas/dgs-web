import React, { Fragment } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'

import { 
  holeInOneRed,
  eagleYellow,
  birdieGreen,
  parGreen,
  bogeyOrange,
  overBogeyPurple 
} from '../../constants/Colors'

const cellHeightNormal = 26
const cellHeightEdit = 35

const useStyles = makeStyles((theme) => ({
  rootPaper: {
    marginBottom: 10,
  },
  strokeEdit: {
    height: cellHeightEdit,
    width: cellHeightEdit,
    textAlign: 'center',
  },
  playerNameEdit: {
    height: cellHeightEdit + 3,
  },
  obEdit: {
    background: 'lightgrey',
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
      height: cellHeightNormal,
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
        minWidth: cellHeightNormal,
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
  bottomRowEdit: {
    '& td': {
      borderBottom: 0,
      height: cellHeightEdit,
    }
  },
  /*
    Score colors.
  */
  holeInOne: {
    backgroundColor: holeInOneRed,
  },
  eagle: {
    backgroundColor: eagleYellow,
  },
  birdie: {
    backgroundColor: birdieGreen,
  },
  par: {
    backgroundColor: parGreen,
  },
  bogey: {
    backgroundColor: bogeyOrange,
  },
  overBogey: {
    backgroundColor: overBogeyPurple,
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
  isEditing: boolean,
}

// TODO: when tapping to edit a stroke/ob, move cursor to end

const ScoreCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, isEditing } = props

  const holeNumbers = game.course.pars.map((par: number, index: number) => (
    <td key={index}>{index + 1}</td>
  ))

  const coursePars = game.course.pars.map((par: number, index: number) => (
    <td key={index}>{par}</td>
  ))

  let pnBottomRowClassName = isEditing ? classes.bottomRowEdit : classes.bottomRow
  let pnRowClassName = isEditing ? classes.playerNameEdit : ''

  const playerNames = game.scores.map((playerScores, index) => (
    <Fragment key={index}>
      <tr className={index + 1 === game.scores.length ? pnBottomRowClassName : pnRowClassName}>
        <td align="left">
          {playerScores.player.firstName}
        </td>
      </tr>
      {isEditing ? (
        <tr className={index + 1 === game.scores.length ? pnBottomRowClassName : pnRowClassName}>
          <td align="right">OB</td>
        </tr>
      ) : null}
    </Fragment>
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

  const playerObEdit = (playerScores: PlayerScores, index: number) => {
    return isEditing ? (
      <tr className={classes.bottomRow}>
        {playerScores.obs.map((obCount: number, index: number) => (
          <td className={classes.obEdit} key={index}>
            <InputBase
              className={classes.strokeEdit}
              defaultValue={obCount}
              inputProps={{ 'aria-label': 'naked', style: { textAlign: 'center' } }}
            />
          </td>
        ))}
      </tr>
    ) : null
  }

  const playerStrokes = (playerScores: PlayerScores, index: number) => (
    <Fragment key={index}>
      <tr className={classes.bottomRow}>
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

          if (isEditing) {
            return (
              <td className={scoreClass} key={index}>
                <InputBase
                  className={classes.strokeEdit}
                  defaultValue={strokeCount}
                  inputProps={{ 'aria-label': 'naked', style: { textAlign: 'center' }}}
                />
              </td>
            )
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
      {playerObEdit(playerScores, index)}
    </Fragment>
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
    <Paper className={classes.rootPaper} elevation={0} >
      {scoreTable}
    </Paper>
  )
}

export default ScoreCard
