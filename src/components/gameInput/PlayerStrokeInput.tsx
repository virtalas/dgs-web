import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(8),
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'lightblue',
    textAlign: 'center',
    margin: 'auto',
  },
  strokeInput: {
    background: '0 0',
    lineHeight: 1,
    border: 0,
    color: '#1f1f21',
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
  strokeInputText: {
    marginLeft: 20,
    marginRight: -25,
  },
  syncText: {
    textAlign: 'center',
  },
}))

interface Props {
  scores: PlayerScores[],
  holeNumber: number,
  onScoreChange: (newScores: PlayerScores[]) => void,
  updating: boolean,
}

// TODO: Change OB input to a button [OB: 0]. Pressing it cycles through values (0, 1, 2, 3)

const PlayerStrokeInput: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { scores, holeNumber, onScoreChange, updating } = props

  const handleStrokeChange = (playerId: string, throws: boolean, event: React.ChangeEvent<HTMLInputElement>) => {
    let strokes = parseInt(event.target.value)
    strokes = isNaN(strokes) ? 0 : strokes
    const playerIndex = scores.findIndex(playerScores => playerScores.player.id === playerId)
    if (throws) {
      // Update throws (strokes):
      scores[playerIndex].strokes[holeNumber - 1] = strokes
    } else {
      // Update OB strokes:
      scores[playerIndex].obs[holeNumber - 1] = strokes
    }
    event.target.blur() // Unfocus/blur the field after inputting a number.
    onScoreChange(scores)
  }

  const rows = scores.map((scoreInfo, index) => (
    <ListItem key={index}>
      <ListItemText primary={scoreInfo.player.firstName} />
      <ListItemText primary={scoreInfo.toPar > 0 ? '+' + scoreInfo.toPar : '\u00A0'+scoreInfo.toPar} />
      <ListItemText primary="OB:" className={classes.strokeInputText} />
      <div className={classes.circle}>
        <input
          className={classes.strokeInput}
          onChange={event => handleStrokeChange(scoreInfo.player.id, false, event)}
          type="tel"
          value={scoreInfo.obs[holeNumber - 1]}
          min="0"
          max="99"
          onFocus={e => e.target.value = '' /* Clear the field when it comes into focus. */}
          onBlur={event => handleStrokeChange(scoreInfo.player.id, false, event)}
          inputMode="numeric"
          pattern="[0-9]*">
        </input>
      </div>
      <ListItemText primary="Throws:" className={classes.strokeInputText} />
      <div className={classes.circle}>
        <input
          className={classes.strokeInput}
          onChange={event => handleStrokeChange(scoreInfo.player.id, true, event)}
          type="tel"
          value={scoreInfo.strokes[holeNumber - 1]} 
          min="0"
          max="99"
          onFocus={e => e.target.value = '' /* Clear the field when it comes into focus. */}
          onBlur={event => handleStrokeChange(scoreInfo.player.id, true, event)}
          inputMode="numeric"
          pattern="[0-9]*">
        </input>
      </div>
    </ListItem>
  ))

  return (
    <div className={classes.root}>
      <List>
        {rows}
        <ListSubheader className={classes.syncText}>
          {updating ? 'Syncing game...' : 'Game synced.'}
        </ListSubheader>
      </List>
    </div>
  )
}

export default PlayerStrokeInput
