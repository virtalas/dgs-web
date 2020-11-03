import React, { ChangeEvent, Fragment } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

import { 
  holeInOneRed,
  eagleYellow,
  birdieGreen,
  parGreen,
  bogeyOrange,
  overBogeyPurple,
  chipGrey,
} from '../../constants/Colors'

const cellHeightNormal = 26
const cellHeightEdit = 35
const trHeightEdit = cellHeightEdit + 3

const useStyles = makeStyles((theme) => ({
  rootPaper: {
    marginBottom: 10,
  },
  strokeEdit: {
    height: cellHeightEdit,
    width: cellHeightEdit,
    textAlign: 'center',
    background: '0 0',
    lineHeight: 1,
    border: 0,
    fontSize: 18,
    fontWeight: 400,
    paddingTop: 3,
    '&:focus': {
      outline: '4px solid white',
    }
  },
  playerNameEdit: {
    height: trHeightEdit,
  },
  obEdit: {
    background: chipGrey,
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
      height: trHeightEdit,
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
  setGame: (game: Game) => void,
  isEditing: boolean,
}

// TODO: when tapping to edit a stroke/ob, move cursor to end
// TODO: Update game & backend when unfocus.

const ScoreCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, setGame, isEditing } = props

  const handleStrokeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const playerName = event.currentTarget.name.split(':')[0]
    const throws = event.currentTarget.name.split(':')[1] === 'stroke'
    const holeIndex = Number(event.currentTarget.name.split(':')[2])
    const stroke = event.currentTarget.value

    if (!isNaN(+stroke) && stroke.length !== 0) {
      // Valid stroke inputted, update game.
      game.scores = updateScores(game.scores, playerName, holeIndex, Number(stroke), game.course, throws)
      setGame(game)
      event.currentTarget.blur() // Unfocus/blur the field after inputting a number.
    } else {
      // No input (or invalid), restore the original stroke.
      const playerScores = game.scores.find(scores => scores.player.firstName === playerName)
      if (throws) {
        event.currentTarget.value = String(playerScores?.strokes[holeIndex])
      } else {
        event.currentTarget.value = String(playerScores?.obs[holeIndex])
      }
    }
  }

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
      <tr className={index + 1 === game.scores.length && !isEditing ? pnBottomRowClassName : pnRowClassName}>
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
            {createStrokeInput(classes.strokeEdit, playerScores.player.firstName, obCount, index, handleStrokeChange, false)}
          </td>
        ))}
        <td></td>
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
                {createStrokeInput(classes.strokeEdit, playerScores.player.firstName, strokeCount, index, handleStrokeChange, true)}
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
    <Fragment key={index}>
      <tr className={isEditing ? classes.bottomRowEdit : classes.bottomRow} key={index}>
        <td>{playerScores.toPar > 0 ? "+" + playerScores.toPar : playerScores.toPar}</td>
      </tr>
      {isEditing ? (<tr className={classes.bottomRowEdit}><td></td></tr>) : null}
    </Fragment>
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

function updateScores(scores: PlayerScores[],
                      playerName: string,
                      holeIndex: number,
                      stroke: number,
                      course: Course,
                      throws: boolean): PlayerScores[] {
  scores.forEach((playerScores, index, array: PlayerScores[]) => {
    // Update the stroke for the player in question
    if (array[index].player.firstName === playerName) {
      if (throws) {
        array[index].strokes[holeIndex] = stroke
      } else {
        array[index].obs[holeIndex] = stroke
      }
    }
    // Update toPar
    let total = 0
    let courseTotal = 0
    for (let holeIndex = 0; holeIndex < array[index].strokes.length; holeIndex++) {
      if (array[index].strokes[holeIndex] !== 0) {
        total += array[index].strokes[holeIndex]
        total += array[index].obs[holeIndex]
        courseTotal += course.pars[holeIndex]
      }
    }
    array[index].total = total
    array[index].toPar = total - courseTotal
  })
  return scores
}

function createStrokeInput(className: string,
                            playerName: string,
                            strokeCount: number,
                            index: number,
                            handleStrokeChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
                            throws: boolean) {
  return (
    <input
      className={className}
      name={playerName + (throws ? ':stroke:' : ':ob:') + index}
      type="tel"
      defaultValue={strokeCount}
      min="0"
      max="99"
      // After tapping a stroke, clear the stroke from the input field.
      onFocus={e => e.target.value = ''}
      // Try to update the changed stroke. But check for empty change (happens at onFocus),
      onChange={e => { if (e.target.value.length > 0) handleStrokeChange(e) }}
      // After editing finishes, try to update once more if user left the field empty
      // (in which case restore the original stroke).
      onBlur={handleStrokeChange}
      inputMode="numeric"
      pattern="[0-9]*">
    </input>
  )
}

export default ScoreCard
