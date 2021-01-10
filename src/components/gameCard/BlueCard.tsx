import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'

import { deepBlue } from '../../constants/Colors'

// Card constants
const horizontalMargin = 1 // vw amount of margin/space from the sides of the screen
const maxMobileCardWidth = window.innerWidth - 0.01 * horizontalMargin * 2 * window.innerWidth
const maxDesktopCardWidth = 700

// Card content constants
const contentHorizontalMargin = 2 // vw amount of margin/space from the sides of the card
const maxMobileContentWidth = maxMobileCardWidth - 0.01 * contentHorizontalMargin * 2 * maxMobileCardWidth
const maxDesktopContentWidth = maxDesktopCardWidth - 0.01 * contentHorizontalMargin * 2 * maxDesktopCardWidth

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: Math.min(maxMobileCardWidth, maxDesktopCardWidth),
    width: '100%',
    marginTop: theme.spacing(4),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(4),
    overflowX: 'hidden',
    backgroundColor: deepBlue,
    position: 'relative', // For positioning edit button.
  },
  content: {
    maxWidth: Math.min(maxMobileContentWidth, maxDesktopContentWidth),
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    textAlign: 'center',
  },
}))

// TODO: Fix horizontal. Try with just CSS. Try with useState for margins

const BlueCard: React.FC<{}> = (props) => {
  const classes = useStyles()
  return (
    <Card className={classes.card} raised={true}>
      <div className={classes.content}>
        {props.children}
      </div>
    </Card>
  )
}

export default BlueCard
