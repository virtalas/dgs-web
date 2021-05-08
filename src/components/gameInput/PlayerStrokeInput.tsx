import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Button } from '@material-ui/core'

import { lightBlue, lightGrey, sneakyGrey } from '../../constants/Colors'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(8),
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: lightBlue,
    textAlign: 'center',
    margin: 'auto',
    paddingRight: 1, // Align par button with throw inputs.
  },
  parCircle: {
    width: 39,
    height: 39,
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'grey',
    '&:active': {
      background: lightGrey,
    },
  },
  strokeInput: {
    background: '0 0',
    lineHeight: 1,
    border: 0,
    fontSize: 25,
    fontWeight: 400,
    boxSizing: 'border-box',
    textAlign: 'center',
    display: 'inline-block',
    paddingTop: 4,
    margin: 'auto',
    width: 40,
    outline: 'none',
  },
  parButtonText: {
    lineHeight: 1,
    fontSize: 17,
    fontWeight: 400,
    textAlign: 'center',
    paddingTop: 10,
    margin: 'auto',
    width: 40,
  },
  throwInputText: {
    marginRight: '5%', // First align with par button, then move left with paddingRight.
    paddingRight: 36,
    width: 70,
    textAlign: 'right',
  },
  obInputText: {
    width: 40,
    marginRight: 9,
    textAlign: 'right',
  },
  throwInputContainer: {
    position: 'absolute',
    right: '5%',
  },
  toParText: {
    width: 20,
    paddingLeft: 20,
  },
  syncText: {
    color: sneakyGrey,
  },
  parButton: {
    position: 'absolute',
    right: '5%',
    top: 2,
  },
  finishButton: {
    width: 155,
    margin: '0 auto', // Center
  },
}), { name: 'MuiHook' })

interface Props {
  scores: PlayerScores[],
  holeNum: number,
  coursePars: number[],
  onScoreChange: (newScores: PlayerScores[]) => void,
  goToPreviewAndFinish: () => void,
  updating: boolean,
}

// TODO?: Change OB input to a button [OB: 0]. Pressing it cycles through values (0, 1, 2, 3)?

const PlayerStrokeInput: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { scores, holeNum, coursePars, onScoreChange, goToPreviewAndFinish, updating } = props

  const handleStrokeChange = (playerId: string, isThrows: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
    let strokes = parseInt(event.target.value)
    strokes = isNaN(strokes) ? 0 : strokes
    const playerIndex = scores.findIndex(playerScores => playerScores.player.id === playerId)

    event.target.blur()
    
    if (isThrows && scores[playerIndex].strokes[holeNum - 1] !== strokes) {
      scores[playerIndex].strokes[holeNum - 1] = strokes
      onScoreChange(scores)
    }
    if (!isThrows && scores[playerIndex].obs[holeNum - 1] !== strokes) {
      scores[playerIndex].obs[holeNum - 1] = strokes
      onScoreChange(scores)
    }
  }

  // Handles the case when the user clicks elsewhere, causing a blur event: display original strokes.
  const handleBlur = (playerId: string, isThrows: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
    let strokes = parseInt(event.target.value)
    const playerIndex = scores.findIndex(playerScores => playerScores.player.id === playerId)

    if (!isNaN(strokes)) {
      return
    }

    if (isThrows) {
      strokes = scores[playerIndex].strokes[holeNum - 1]
    } else {
      strokes = scores[playerIndex].obs[holeNum - 1]
    }

    event.target.value = String(strokes)
  }

  const handleParClick = () => {
    scores.forEach((playerScores: PlayerScores) => {
      playerScores.strokes[holeNum - 1] = coursePars[holeNum - 1]
    })
    onScoreChange(scores)
  }

  const finishButton = (
    <Button
      variant="outlined"
      onClick={() => goToPreviewAndFinish()}
    >
      Preview & Finish Game
    </Button>
  )

  const rows = scores.map((scoreInfo, index) => (
    <ListItem key={index}>
      <ListItemText primary={scoreInfo.player.firstName} />
      <ListItemText
        className={classes.toParText}
        data-cy="toPar"
        primary={scoreInfo.toPar > 0 ? '+' + scoreInfo.toPar : scoreInfo.toPar}
      />
      <ListItemText primary="OB:" className={classes.obInputText} />
      <div className={classes.circle}>
        <input
          className={classes.strokeInput}
          onChange={event => handleStrokeChange(scoreInfo.player.id, false, event)}
          type="tel"
          value={scoreInfo.obs[holeNum - 1]}
          min="0"
          max="99"
          onFocus={e => e.target.value = '' /* Clear the field when it comes into focus. */}
          onBlur={event => handleBlur(scoreInfo.player.id, false, event)}
          inputMode="numeric"
          pattern="[0-9]*">
        </input>
      </div>
      <ListItemText primary="Throws:" className={classes.throwInputText} />
      <div className={classes.throwInputContainer}>
        <div className={classes.circle}>
          <input
            className={classes.strokeInput}
            onChange={event => handleStrokeChange(scoreInfo.player.id, true, event)}
            type="tel"
            value={scoreInfo.strokes[holeNum - 1]}
            min="0"
            max="99"
            onFocus={e => e.target.value = '' /* Clear the field when it comes into focus. */}
            onBlur={event => handleBlur(scoreInfo.player.id, true, event)}
            inputMode="numeric"
            pattern="[0-9]*">
          </input>
        </div>
      </div>
    </ListItem>
  ))

  return (
    <div className={classes.root}>
      <List>
        {rows}
        <ListItem>
          <ListItemText className={classes.syncText}>
            {updating ? 'Syncing game...' : 'Game synced.'}
          </ListItemText>
          <ListItemText className={classes.parButton}>
            <div className={classes.parCircle} onClick={handleParClick}>
              <div className={classes.parButtonText} data-cy="parCircleButton">Par</div>
            </div>
          </ListItemText>
        </ListItem>
        {holeNum === coursePars.length ? (
          <ListItem className={classes.finishButton}>{finishButton}</ListItem>
        ) : null}
      </List>
    </div>
  )
}

export default PlayerStrokeInput
