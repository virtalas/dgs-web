import React from 'react'

import { makeStyles } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing.unit * 8,
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
  syncText: {
    textAlign: 'center',
  }
}))

interface Props {
  scores: PlayerScores[],
  holeNumber: number,
  onScoreChange: (newScores: PlayerScores[]) => void,
  updating: boolean,
}

const PlayerStrokeInput: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { scores, holeNumber, onScoreChange, updating } = props

  const handleStrokeChange = (playerId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    let strokes = parseInt(event.target.value)
    strokes = isNaN(strokes) ? 0 : strokes
    const playerIndex = scores.findIndex(playerScores => playerScores.player.id === playerId)
    scores[playerIndex].strokes[holeNumber - 1] = strokes
    event.target.blur() // Unfocus/blur the field after inputting a number.
    onScoreChange(scores)
  }

  const rows = scores.map((scoreInfo, index) => (
    <ListItem key={index}>
      <ListItemText primary={scoreInfo.player.firstName} />
      <ListItemText primary="-X" />
      <ListItemText primary="OB:" />
      <ListItemText primary="Throws:" />
      <div className={classes.circle}>
        <input
          className={classes.strokeInput}
          onChange={event => handleStrokeChange(scoreInfo.player.id, event)}
          type="tel"
          value={scoreInfo.strokes[holeNumber - 1]} 
          min="0"
          max="99"
          onFocus={e => e.target.value = '' /* Clear the field when it comes into focus. */}
          onBlur={event => handleStrokeChange(scoreInfo.player.id, event)}
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
          {updating ? 'Syncing game...' : 'The game was synced X minutes ago.'}
        </ListSubheader>
      </List>
    </div>
  )
}

export default PlayerStrokeInput
