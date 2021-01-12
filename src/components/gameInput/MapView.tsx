import React from 'react'
// @ts-ignore
import { MapInteractionCSS } from 'react-map-interaction'
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
    marginTop: theme.spacing(7),
    width: '100%',
    height: '100%',
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
    <div id="mapView" className={classes.root}>
      {mapURL.length > 0 ? (
        <MapInteractionCSS minScale={1}>
          <div className={classes.imageContainer}>
            <img
              className={classes.image}
              src={mapURL}
              alt="Course map"
            />
          </div>
        </MapInteractionCSS>
      ) : (
        <div><br /><br /><br /><br /><br />No course map added.</div>
      )}
    </div>
  )
}

export default MapView
