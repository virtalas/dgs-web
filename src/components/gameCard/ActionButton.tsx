import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@material-ui/icons/Delete'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  actionAreaBottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 8,
    zIndex: 10,
  },
  actionAreaBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    zIndex: 10,
  },
  actionAreaTopRight: {
    position: 'absolute',
    top: 10,
    right: 8,
    zIndex: 10,
    color: 'white',
  },
  actionAreaBottomSecondary: {
    position: 'absolute',
    bottom: 10,
    right: 68,
  },
  actionAreaBottomThird: {
    position: 'absolute',
    bottom: 10,
    right: 128,
  },
  textButton: {
    margin: 8,
  },
  spinner: {
    padding: 5,
  },
  error: {
    marginRight: 40,
    color: 'red',
  },
}))

interface Props {
  variant:  'ok' | 'edit' | 'cancel' | 'delete' | 'loadingOnly' | 'text',
  position: 'top' | 'bottom',
  text?: string,
  secondary?: boolean,
  third?: boolean,
  onLeft?: boolean,
  loading?: boolean,
  error?: boolean,
  onClick: () => void,
  fontSize?: number,
}

const ActionButton: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { variant, position, text, secondary, third, onLeft, loading, error, onClick, fontSize } = props

  let className = position === 'top' ? classes.actionAreaTopRight : classes.actionAreaBottomRight
  
  if (secondary) {
    className = classes.actionAreaBottomSecondary
  } else if (third) {
    className = classes.actionAreaBottomThird
  } else if (onLeft) {
    className = classes.actionAreaBottomLeft
  }

  const progressSpinner = (
    <div className={className}>
      <CircularProgress className={classes.spinner} size={40} color={position === 'top' ? 'inherit' : 'primary' } />
    </div>
  )

  const errorIndicator = error ? (
    <div className={className} title="Updating game failed">
      <ErrorOutlineIcon className={classes.error} fontSize="large" />
    </div>
  ) : null

  let icon

  switch (variant) {
    case 'ok':
      icon = <DoneIcon />
      break
    case 'edit':
      icon = <EditIcon />
      break
    case 'cancel':
      icon = <ClearIcon />
      break
    case 'delete':
      icon = <DeleteIcon />
      break
    default:
      icon = null
  }

  if (text !== undefined) {
    return (
      <Button
        className={className + ' ' + classes.textButton}
        variant="outlined"
        size="small"
        style={{ fontSize: fontSize }}
        onClick={onClick}
      >
        {text}
      </Button>
    )
  }

  const button = variant !== 'loadingOnly' ? (
    <IconButton
      className={className}
      onClick={onClick}
    >
      {icon}
    </IconButton>
  ) : null

  return (
    <div>
      {errorIndicator}
      {loading ? progressSpinner : button}
    </div>
  )
}

export default ActionButton