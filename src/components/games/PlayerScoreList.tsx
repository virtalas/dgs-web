import React, { useState } from 'react'

import { makeStyles } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'

import BlueCard from '../BlueCard'

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
    // TODO: check how to:
    // fontFamily: "-apple-system,'Helvetica Neue',Helvetica,Arial,'Lucida Grande',sans-serif",
    // webkitFontSmoothing: 'antialiased',
    /*-webkit-appearance: none;*/
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
  },
}))

interface Props {
  scores: PlayerScores[],
}

const PlayerScoreList: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { scores } = props
  const [checked, setChecked] = useState(true)

  const handleToggle = (value: any) => {
    console.log(value)
    // setChecked(!value)
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
          onChange={event => handleToggle(checked)}
          type="number"
          value="0"
          min="0"
          max="99"
          inputMode="numeric"
          pattern="[0-9]*">
        </input>
      </div>
      <ListItemSecondaryAction>
        {/*<Switch
          onChange={event => handleToggle(checked)}
          checked={checked}
        />*/}
      </ListItemSecondaryAction>
    </ListItem>
  ))

  return (
    <div className={classes.root}>
      <BlueCard>
        <Paper>
          <List>
            {rows}
            <ListSubheader>Scores were last sent X minutes ago.</ListSubheader>
          </List>
        </Paper>
      </BlueCard>
    </div>
  )
}

export default PlayerScoreList
