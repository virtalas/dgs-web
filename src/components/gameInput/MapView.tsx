import React from 'react'
import { makeStyles } from '@material-ui/core'

import { sneakyGrey } from '../../constants/Colors'

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    color: sneakyGrey,
  },
}))


const MapView: React.FC<{}> = () => {
  const classes = useStyles()

  // TODO

  return (
    <div className={classes.root}>
      <br /><br /><br /><br /><br />No course map added.
    </div>
  )
}

export default MapView
