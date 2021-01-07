import React from 'react'
import { makeStyles } from '@material-ui/core'

import { sneakyGrey } from '../../constants/Colors'

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    color: sneakyGrey,
  },
  image: {
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 100,
    overflow: 'hidden',
    // Center mapPlaceholderText vertically:
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
}))

interface Props {
  mapURL: string,
}

const MapView: React.FC<Props> = (props) => {
  const classes = useStyles()

  const { mapURL } = props

  return (
    <div className={classes.root}>
      {mapURL.length > 0 ? (
        <div className={classes.imageContainer}>
          {/* TODO: Clicking image opens popup of course map */}
          <img
            className={classes.image}
            src={mapURL}
          />
        </div>
      ) : (
        <div><br /><br /><br /><br /><br />No course map added.</div>
      )}
      
    </div>
  )
}

export default MapView
