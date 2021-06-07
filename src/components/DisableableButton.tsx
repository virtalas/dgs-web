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
  text: string,
  variant?: 'contained' | 'text',
}

// This component exists to fi a Material UI bug (?) in Safari:
// When a button is disabled by a React hook and becomes enabled, the style does not update correctly.
// The text color does not change to white going from disabled to enabled.

const DisableableButton: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { onClick, disabled, text, variant } = props

  const buttonVariant = variant ? variant : 'contained'

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
      {text}
    </Button>
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
          {text}
        </Button>
      ) : null}

      {disabled ? null : (
        <Button
          variant="text"
          color="primary"
          onClick={onClick}
        >
          {text}
        </Button>
      )}
    </div>
  )

  return buttonVariant === 'contained' ? containedButton : textButton
}

export default DisableableButton
