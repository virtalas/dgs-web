import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Card from '@material-ui/core/Card'
import { addOrientationListener } from '../../utils/OrientationListener';


const BlueCard: React.FC<{}> = (props) => {
  const [orientation, orientationChange] = useState<Boolean>(true)

  addOrientationListener(() => {
    // console.log("inner: ", window.innerWidth)
    // innerWidth = window.innerWidth
    orientationChange(!orientation)
  })


  const portraitWidth = Math.min(window.innerWidth, window.innerHeight)
  const landscapeWidth = Math.max(window.innerWidth, window.innerHeight)

  console.log("w", window.innerWidth)
  console.log("h", window.innerHeight)

  /**
   * Card constants for mobile
   */
  // try to pass rootWidth down from <Games> to game cards
  // Portrait:
  const cardHorizontalMarginPortrait = 1 // vw amount of margin/space from the sides of the screen
  const maxMobileCardWidthPortrait = portraitWidth - 0.01 * cardHorizontalMarginPortrait * 2 * portraitWidth
  // Landscape:
  const horizontalMarginLandscape = 2 // vw amount of margin/space from the sides of the screen
  const maxMobileCardWidthLandscape = landscapeWidth - 0.01 * horizontalMarginLandscape * 2 * landscapeWidth

  /**
   * Content constants for mobile
   */

  // Portrait:
  const contentHorizontalMarginPortrait = 2 // vw amount of margin/space from the sides of the card
  const maxMobileContentWidthPortrait = maxMobileCardWidthPortrait - 0.01 * contentHorizontalMarginPortrait * 2 * maxMobileCardWidthPortrait
  // Landscape:
  const contentHorizontalMarginLandscape = 2.5 // vw amount of margin/space from the sides of the card
  const maxMobileContentWidthLandscape = maxMobileCardWidthLandscape - 0.01 * contentHorizontalMarginLandscape * 2 * maxMobileCardWidthLandscape

  /**
   * Constants for desktop
   */

  const maxDesktopCardWidth = 700
  const maxDesktopContentWidth = maxDesktopCardWidth - 0.01 * contentHorizontalMarginLandscape * 2 * maxDesktopCardWidth

  /**
   * makeStyles
   */

  const useStyles = makeStyles((theme) => ({
    card: {
      // Mobile:
      [theme.breakpoints.down('md')]: {
        '@media (orientation: portrait)': {
          maxWidth: maxMobileCardWidthPortrait,
        },
        '@media (orientation: landscape)': {
          maxWidth: maxMobileCardWidthLandscape,
        },
      },
      // Desktop:
      [theme.breakpoints.up('md')]: {
        maxWidth: maxDesktopCardWidth,
      },
      width: '100%',
      marginTop: theme.spacing.unit * 4,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: theme.spacing.unit * 4,
      overflowX: 'hidden',
      backgroundColor: '#3087C1',
    },
    content: {
      // Mobile:
      [theme.breakpoints.down('md')]: {
        '@media (orientation: portrait)': {
          maxWidth: maxMobileContentWidthPortrait,
        },
        '@media (orientation: landscape)': {
          maxWidth: maxMobileContentWidthLandscape,
        },
      },
      // Desktop:
      [theme.breakpoints.up('md')]: {
        maxWidth: maxDesktopContentWidth,
      },
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit,
      textAlign: 'center',
    },
  }))

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
