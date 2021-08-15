import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

const useStyles = makeStyles((theme) => ({
  centerContainer: {
    height: theme.spacing(30),
    position: 'relative',
    zIndex: -1, // Don't block navigation controls.
  },
  centerIcon: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  errorText: {
    color: 'grey',
    margin: 0,
    position: 'absolute',
    top: '50%',
    marginTop: 20,
    left: '50%',
    marginLeft: -40,
    transform: 'translate(-50 %, -50 %)',
  }
}))

const ErrorView: React.FC<{}> = () => {
  const classes = useStyles()
  
  return (
    <div className={classes.centerContainer}>
      <ErrorOutlineIcon className={classes.centerIcon} />
      <span className={classes.errorText}>Failed to load</span>
    </div>      
  )
}  

export default ErrorView
