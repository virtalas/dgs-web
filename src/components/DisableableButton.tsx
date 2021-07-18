import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  disabledContainedButton: {
    "&:disabled": {
      color: 'white',
    }
  },
}))

interface Props {
  onClick: () => void,
  disabled: boolean,
  variant?: 'contained' | 'text' | 'outlined',
  size?: 'small',
}

// This component exists to fix a Material UI bug (?) in Safari:
// When a button is disabled by a React hook and becomes enabled, the style does not update correctly.
// Specifically, the text color does not change when going from disabled to enabled.

const DisableableButton: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { onClick, disabled, variant, size } = props

  // For contained buttons, we can just have the text color always be white.
  const containedButton = (
    <Button
      classes={{
        disabled: classes.disabledContainedButton,
      }}
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
    >
      {props.children}
    </Button>
  )

  // For outlined buttons, the text color has to change, so use two buttons.
  const outlinedButton = (
    <div>
      {disabled ? (
        <Button
          variant="outlined"
          size={size ? size : 'medium'}
          disabled={true}
        >
          {props.children}
        </Button>
      ) : null}

      {disabled ? null : (
        <Button
          variant="outlined"
          size={size ? size : 'medium'}
          onClick={onClick}
        >
          {props.children}
        </Button>
      )}
    </div>
  )

  // For text buttons, the text color has to change, so use two buttons.
  const textButton = (
    <div>
      {disabled ? (
        <Button
          variant="text"
          color="primary"
          disabled={true}
        >
          {props.children}
        </Button>
      ) : null}

      {disabled ? null : (
        <Button
          variant="text"
          color="primary"
          onClick={onClick}
        >
          {props.children}
        </Button>
      )}
    </div>
  )

  switch (variant) {
    case "contained":
      return containedButton
    case "outlined":
      return outlinedButton
    case "text":
      return textButton
    default:
      return containedButton
  }
}

export default DisableableButton
