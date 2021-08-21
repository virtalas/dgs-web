import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import {
  birdieGreen,
  bogeyOrange,
  eagleYellow,
  holeInOneRed,
  lightBlue,
  lightGrey,
  overBogeyPurple,
  parGreen,
  sneakyGrey
} from '../../constants/Colors'

const circleWidth = 50

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(7),
  },
  circle: {
    width: circleWidth,
    height: circleWidth,
    borderRadius: '50%',
    textAlign: 'center',
    margin: 'auto',
    marginLeft: theme.spacing(3),
  },
  parCircle: {
    width: circleWidth - 1,
    height: circleWidth - 1,
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
    paddingTop: 9,
    margin: 'auto',
    width: 50,
    outline: 'none',
  },
  parButtonText: {
    lineHeight: 1,
    fontSize: 20,
    fontWeight: 400,
    textAlign: 'center',
    paddingTop: 15,
    margin: 'auto',
  },
  headerText: {
    width: circleWidth,
    marginLeft: theme.spacing(3),
  },
  headerTextOb: {
    textAlign: 'center',
  },
  playerNameText: {
    fontSize: 20,
  },
  rowRightSideContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // Cut off player names that are too long.
  },
  syncText: {
    color: sneakyGrey,
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

  const headerRow = (
    <ListItem>
      <ListItemText>
        <Typography variant="overline">Player</Typography>
      </ListItemText>

      <div className={classes.rowRightSideContainer}>
        <ListItemText className={classes.headerText}>
          <Typography variant="overline">To par</Typography>
        </ListItemText>
        <ListItemText className={classes.headerText + ' ' + classes.headerTextOb}>
          <Typography variant="overline">OB</Typography>
        </ListItemText>
        <ListItemText className={classes.headerText}>
          <Typography variant="overline">Throws</Typography>
        </ListItemText>
      </div>
    </ListItem>
  )

  const scoreInputRows = scores.map((scoreInfo, index) => {
    const throws = scoreInfo.strokes[holeNum - 1]

    let toParColor
    if (throws === 0) {
      toParColor = lightBlue
    } else if (throws === 1) {
      toParColor = holeInOneRed
    } else if (scoreInfo.toPar === -2) {
      toParColor = eagleYellow
    } else if (scoreInfo.toPar === -1) {
      toParColor = birdieGreen
    } else if (scoreInfo.toPar === 0) {
      toParColor = parGreen
    } else if (scoreInfo.toPar === 1) {
      toParColor = bogeyOrange
    } else if (scoreInfo.toPar >= 2) {
      toParColor = overBogeyPurple
    }

    return (
      <ListItem key={index}>
        <ListItemText>
          <span className={classes.playerNameText}>
            {scoreInfo.player.firstName}
          </span>
        </ListItemText>
  
        <div className={classes.rowRightSideContainer}>
          <ListItemText>
            <span className={classes.playerNameText}>
              {scoreInfo.toPar > 0 ? '+' + scoreInfo.toPar : scoreInfo.toPar}
            </span>
          </ListItemText>
  
          <div
            className={classes.circle}
            style={{ background: lightBlue }}
          >
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
  
          <div
            className={classes.circle}
            style={{ background: toParColor }}
          >
            <input
              className={classes.strokeInput}
              onChange={event => handleStrokeChange(scoreInfo.player.id, true, event)}
              type="tel"
              value={throws}
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
    )
  })

  const syncTextAndParButtonRow = (
    <ListItem>
      <ListItemText className={classes.syncText}>
        {updating ? 'Syncing game...' : 'Game synced.'}
      </ListItemText>

      <div className={classes.rowRightSideContainer}>
        <ListItemText>
          <div className={classes.parCircle} onClick={handleParClick}>
            <div className={classes.parButtonText} data-cy="parCircleButton">Par</div>
          </div>
        </ListItemText>
      </div>
    </ListItem>
  )

  const finishButton = (
    <Button
      variant="outlined"
      onClick={() => goToPreviewAndFinish()}
    >
      Preview & Finish Game
    </Button>
  )

  const finishButtonRow = holeNum === coursePars.length ? (
    <ListItem className={classes.finishButton}>{finishButton}</ListItem>
  ) : null

  return (
    <div className={classes.root}>
      <List>
        {headerRow}
        {scoreInputRows}
        {syncTextAndParButtonRow}
        {finishButtonRow}
      </List>
    </div>
  )
}

export default PlayerStrokeInput
