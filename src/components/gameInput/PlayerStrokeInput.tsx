import React from 'react'

import { makeStyles } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'

import BlueCard from '../gameCard/BlueCard'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing.unit * 7,
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
    const playerIndex = scores.findIndex(playerScores => playerScores.player.id === playerId)
    scores[playerIndex].strokes[holeNumber - 1] = parseInt(event.target.value)
    event.target.blur() // Unfocus/blur the field after inputting a number.
    onScoreChange(scores)
  }

  const rows = scores.map((scoreInfo, index) => (
    <ListItem key={index}>
      <ListItemText primary={scoreInfo.player.firstName} />
      <ListItemText primary="-3" />
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
          inputMode="numeric"
          pattern="[0-9]*">
        </input>
      </div>
    </ListItem>
  ))

  return (
    <div className={classes.root}>
      <BlueCard>
        <Paper>
          <List>
            {rows}
            <ListSubheader>
              {updating ? 'Syncing game...' : 'The game was synced X minutes ago.'}
            </ListSubheader>
          </List>
        </Paper>
      </BlueCard>
    </div>
  )
}

export default PlayerStrokeInput
