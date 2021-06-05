import React from 'react'

import Fab from '@material-ui/core/Fab'
import { makeStyles } from '@material-ui/core/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

const buttonHeight = 110
const buttonEdgeMargin = 2
const buttonBottomMargin = 13

const useStyles = makeStyles((theme) => ({
  prevHole: {
    position: 'fixed',
    bottom: buttonBottomMargin + '%',
    left: buttonEdgeMargin + '%',
    height: buttonHeight,
    width: buttonHeight,
    [theme.breakpoints.up('sm')]: {
      left: '25%',
    },
  },
  nextHole: {
    position: 'fixed',
    bottom: buttonBottomMargin + '%',
    right: buttonEdgeMargin + '%',
    height: buttonHeight,
    width: buttonHeight,
    [theme.breakpoints.up('sm')]: {
      right: '25%',
    },
  },
}))

interface Props {
  onPrevHole: Function,
  onNextHole: Function,
}

const HoleNavigation: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { onPrevHole, onNextHole } = props

  return (
    <div>
      <Fab
        disableRipple
        color="primary"
        data-cy="previousHole"        
        className={classes.prevHole}
        onClick={() => onPrevHole()}
      >
        <ArrowBackIosIcon />
      </Fab>

      <Fab
        disableRipple
        color="primary"
        data-cy="nextHole"        
        className={classes.nextHole}
        onClick={() => onNextHole()}
      >
        <ArrowForwardIosIcon />
      </Fab>
    </div>
  )
}

export default HoleNavigation
