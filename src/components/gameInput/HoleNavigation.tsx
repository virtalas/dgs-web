import React from 'react'

import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

const buttonHeight = 110
const buttonEdgeMargin = 2
const buttonBottomMargin = 13

const parButtonWidth = 80
const parButtonHeight = 40

const useStyles = makeStyles((theme) => ({
  prevHole: {
    position: 'fixed',
    bottom: buttonBottomMargin + '%',
    left: buttonEdgeMargin + '%',
    height: buttonHeight,
    width: buttonHeight,
  },
  nextHole: {
    position: 'fixed',
    bottom: buttonBottomMargin + '%',
    right: buttonEdgeMargin + '%',
    height: buttonHeight,
    width: buttonHeight,
  },
  par: {
    margin: 'auto',
    position: 'fixed',
    left: window.innerWidth / 2 - parButtonWidth / 2, // Place it in the center.
    bottom: buttonBottomMargin + '%',
    width: parButtonWidth,
    height: parButtonHeight,
  }
}))

interface Props {
  holeNum: number,
  showPar: boolean,
  onPrevHole: Function,
  onNextHole: Function,
}

const HoleNavigation: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { showPar, onPrevHole, onNextHole } = props

  return (
    <div>
      <Fab color="primary" aria-label="Add" className={classes.prevHole} onClick={() => onPrevHole()}>
        <ArrowBackIosIcon />
      </Fab>
      {showPar ? (
        <Button variant="contained" size="medium" color="primary" className={classes.par}>
          Par
        </Button>
      ) : null}
      <Fab color="primary" aria-label="Add" className={classes.nextHole} onClick={() => onNextHole()}>
        <ArrowForwardIosIcon />
      </Fab>
    </div>
  )
}

export default HoleNavigation
