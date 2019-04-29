import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

const styles = theme => ({
  infoPaper: {
    marginBottom: 10,
    padding: 6,
    textAlign: 'left',
  },
  chip: {
    height: 22,
    marginRight: 5,
  },
  chipRow: {
    lineHeight: '28px', // Affects spacing between chips when wrapped to two rows.
  },
  highScoreChip: {
    height: 22,
    width: "100%",
    fontSize: '97%',
    cursor: 'pointer',
    backgroundColor: '#4353b3',
    color: 'white',
    marginLeft: -1,
  },
  illegalChip: {
    height: 22,
    width: "100%",
    fontSize: '97%',
    cursor: 'pointer',
    backgroundColor: '#f2105a',
    color: 'white',
    marginLeft: -1,
  },
  comment: {
    marginTop: 5,
  },
})

function handleClick() {
  // TODO: Direct to player's page
}

function GameInfo(props) {
  const { classes, game } = props

  const conditions = (
    <div className={classes.chipRow}>
      {game.temperature ? <Chip className={classes.chip} label={game.temperature + " °C"} /> : null}
      {game.weatherConditions.map((condition, index) => (
        <Chip className={classes.chip} label={condition} key={index} />
      ))}
      {game.conditions.map((condition, index) => (
        <Chip className={classes.chip} label={condition} key={index} />
      ))}
    </div>
  )

  const illegalAndHighScorers = (
    <div className={classes.chipRow}>
      {game.highScorers.map((name, index) => (
        <Chip
          classes={{ icon: classes.highScoreChip }}
          icon={<Chip label="High score" />}
          label={name}
          variant="outlined"
          color="primary"
          onClick={handleClick}
          className={classes.chip}
          key={index} />
      ))}
      {game.illegalScorers.map((name, index) => (
        <Chip
          classes={{ icon: classes.illegalChip }}
          icon={<Chip label="Illegal game" />}
          label={name}
          variant="outlined"
          color="secondary"
          onClick={handleClick}
          className={classes.chip}
          key={index} />
      ))}
    </div>
  )

  const shouldShowInfoPaper = game.temperature || game.weatherConditions.length || game.conditions.length ||
                              game.highScorers.length || game.illegalScorers.length || game.comment || game.contestName

  return (
    <div>
      {shouldShowInfoPaper ? (
        <Paper className={classes.infoPaper}>
          {conditions}
          {illegalAndHighScorers}
          <Typography className={classes.comment} align="left" variant="body1">{game.comment}</Typography>
        </Paper>
      ) : null}
    </div>
  )
}

GameInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  game: PropTypes.object.isRequired,
}

export default withStyles(styles)(GameInfo)
