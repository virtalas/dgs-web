import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles((theme) => ({
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
}))

interface Props {
  game: Game
}

const GameInfo: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game } = props

  const handlePlayerClipClick = () => {
    // TODO
    alert('Coming soon: Go to clicked player\'s page!')
  }

  const handleConditionChipClick = () => {
    // TODO
    alert('Coming soon: Search games by clicked condition!')
  }

  const conditions = (
    <div className={classes.chipRow}>
      {game.temperature ? <Chip className={classes.chip} label={game.temperature + " °C"} onClick={handleConditionChipClick} /> : null}
      {game.weatherConditions.map((condition: Condition, index: number) => (
        <Chip className={classes.chip} label={condition} onClick={handleConditionChipClick} key={index} />
      ))}
      {game.conditions.map((condition: Condition, index: number) => (
        <Chip className={classes.chip} label={condition} onClick={handleConditionChipClick} key={index} />
      ))}
    </div>
  )

  const illegalAndHighScorers = (
    <div className={classes.chipRow}>
      {game.highScorers.map((name: string, index: number) => (
        <Chip
          classes={{ icon: classes.highScoreChip } as any}
          icon={<Chip label="High score" />}
          label={name}
          variant="outlined"
          color="primary"
          onClick={handlePlayerClipClick}
          className={classes.chip}
          key={index} />
      ))}
      {game.illegalScorers.map((name: string, index: number) => (
        <Chip
          classes={{ icon: classes.illegalChip } as any}
          icon={<Chip label="Illegal game" />}
          label={name}
          variant="outlined"
          color="secondary"
          onClick={handlePlayerClipClick}
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
        <Paper className={classes.infoPaper} elevation={0}>
          {conditions}
          {illegalAndHighScorers}
          <Typography className={classes.comment} align="left" variant="body1">{game.comment}</Typography>
        </Paper>
      ) : null}
    </div>
  )
}

export default GameInfo
