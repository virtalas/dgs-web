import React from 'react'

import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/styles'

const buttonHeight = 110
const buttonEdgeMargin = 2
const buttonBottomMargin = 12

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
}

const HoleNavigation: React.FC<Props> = (props) => {
  const classes = useStyles()

  return (
    <div>
      <Fab color="primary" aria-label="Add" className={classes.prevHole}>
        ◀
      </Fab>
      <Button variant="contained" size="medium" color="primary" className={classes.par}>
        Par
        </Button>
      {/* TODO: Big hole number. */}
      <Fab color="primary" aria-label="Add" className={classes.nextHole}>
        ▶
      </Fab>
    </div>
  )
}

export default HoleNavigation
