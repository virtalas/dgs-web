import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

// Card constants
const horizontalMargin = 1 // vw amount of margin/space from the sides of the screen
const maxMobileCardWidth = window.innerWidth - 0.01 * horizontalMargin * 2 * window.innerWidth
const maxDesktopCardWidth = 700

// Card content constants
const contentHorizontalMargin = 2 // vw amount of margin/space from the sides of the card
const maxMobileContentWidth = maxMobileCardWidth - 0.01 * contentHorizontalMargin * 2 * maxMobileCardWidth
const maxDesktopContentWidth = maxDesktopCardWidth - 0.01 * contentHorizontalMargin * 2 * maxDesktopCardWidth

const styles = theme => ({
  card: {
    maxWidth: Math.min(maxMobileCardWidth, maxDesktopCardWidth),
    width: '100%',
    marginTop: theme.spacing.unit * 4,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing.unit * 4,
    overflowX: 'hidden',
    backgroundColor: '#3087C1',
  },
  content: {
    maxWidth: Math.min(maxMobileContentWidth, maxDesktopContentWidth),
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    textAlign: 'center',
  },
})

function BlueCard(props) {
  const { classes } = props
  return (
    <Card className={classes.card}>
      <div className={classes.content}>
        {props.children}
      </div>
    </Card>
  )
}

BlueCard.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(BlueCard)
