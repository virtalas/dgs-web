import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
  progress: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
}))

const LoadingView: React.FC<{}> = () => {
  const classes = useStyles()
  
  return (
    <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress} />
    </div>
  )
}  

export default LoadingView
