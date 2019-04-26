import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  root: {
  },
}))

function PlayerScoreList(props) {
  const classes = useStyles()
  const { players } = props
  const [checked, setChecked] = useState(
    true
  )

  const handleToggle = (value) => {
    console.log(value)
    setChecked(!value)
  }

  const rows = players.map((player, index) => (
    <ListItem key={index}>
      <ListItemText primary={player} />
      <ListItemText primary="-3" />
      <ListItemText primary="OB:" />
      <ListItemText primary="Throws:" />
      <ListItemSecondaryAction>
        <Switch
          onChange={event => handleToggle(checked)}
          checked={checked}
        />
      </ListItemSecondaryAction>
    </ListItem>
  ))

  return (
    <List subheader={<ListSubheader>Settings</ListSubheader>} className={classes.root}>
      {rows}
      <ListSubheader>Scores were last sent X minutes ago.</ListSubheader>
    </List>
  )
}

export default PlayerScoreList
