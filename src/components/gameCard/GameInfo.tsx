import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

import { highScoreBlue, illegalRed } from '../../constants/Colors'
import { InputAdornment, TextField } from '@material-ui/core'

const chipHeight = 22

const useStyles = makeStyles((theme) => ({
  infoPaper: {
    marginBottom: 10,
    padding: 6,
    textAlign: 'left',
  },
  chip: {
    height: chipHeight,
    marginRight: 5,
  },
  chipRow: {
    lineHeight: '28px', // Affects spacing between chips when wrapped to two rows.
  },
  highScoreChip: {
    height: chipHeight,
    width: 90,
    fontSize: '97%',
    cursor: 'pointer',
    backgroundColor: highScoreBlue,
    color: 'white',
    position: 'relative',
    left: -5,
  },
  illegalChip: {
    height: chipHeight,
    width: 100,
    fontSize: '97%',
    cursor: 'pointer',
    backgroundColor: illegalRed,
    color: 'white',
    position: 'relative',
    left: -5,
  },
  illegalDisabledChip: {
    height: chipHeight,
    width: 100,
    fontSize: '97%',
    cursor: 'pointer',
    position: 'relative',
    left: -5,
  },
  comment: {
    marginTop: 5,
  },
  temperatureEdit: {
    width: 130,
    marginBottom: 10,
  },
  commentEdit: {
    width: '100%',
    marginTop: 10,
    marginBottom: 40, // Make room for 'Save' and 'Cancel' buttons.
  },
}))

interface Props {
  game: Game,
  setGame: (game: Game) => void,
  isEditing: boolean,
  availableWeatherConditions: Condition[],
  availableConditions: Condition[],
}

// TODO: Temperature editing: use numeric keyboard

const GameInfo: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, setGame, isEditing, availableWeatherConditions, availableConditions } = props

  // eslint-disable-next-line
  const gameTemperature = game.temperature != null || game.temperature != undefined ? game.temperature : ''
  const [temperature, setTemperature] = useState<string>(String(gameTemperature))
  const [comment, setComment] = useState<string>(game.comment)

  const handlePlayerClipClick = (event: React.MouseEvent) => {
    const name = event.currentTarget.textContent?.split('Illegal game')[1]
    if (isEditing) {
      if (game.illegalScorers.find(n => n === name)) {
        game.illegalScorers = game.illegalScorers.filter(n => n !== name)
      } else {
        game.illegalScorers = game.illegalScorers.concat(String(name))
      }
      setGame(game)
    } else {
      // TODO
      alert('Coming soon: Go to ' + name + '\'s page!')
    }
  }

  const handleConditionChipClick = () => {
    // TODO
    alert('Coming soon: Search games by clicked condition!')
  }

  // TODO: temperature field shouldn't accept space (' ')
  const handleTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    if (input === '-') {
      setTemperature(input)
    } else if (!isNaN(Number(input)) || input === '') {
      setTemperature(input)
    }
  }

  const handleTemperatureBlur = (_: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    game.temperature = temperature === '' ? null : Number(temperature)
    setGame(game)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value)
  }

  const handleCommentBlur = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    game.comment = comment
    setGame(game)
  }

  const handleConditionToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const condition = event.currentTarget.querySelector('.MuiChip-label')?.textContent as Condition
    if (!game.conditions.includes(condition)) {
      game.conditions = game.conditions.concat(condition)
    } else {
      game.conditions = game.conditions.filter(c => c !== condition)
    }
    setGame(game)
  }

  const handleWeatherConditionToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const condition = event.currentTarget.querySelector('.MuiChip-label')?.textContent as Condition
    if (!game.weatherConditions.includes(condition)) {
      game.weatherConditions = game.weatherConditions.concat(condition)
    } else {
      game.weatherConditions = game.weatherConditions.filter(c => c !== condition)
    }
    setGame(game)
  }

  const selected = (condition: Condition): boolean => {
    return game.weatherConditions.includes(condition) || game.conditions.includes(condition)
  }

  game.conditions.sort()
  game.weatherConditions.sort()

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

  const temperatureEdit = isEditing ? (
    <TextField
      className={classes.temperatureEdit}
      label="Temperature"
      size="small"
      value={temperature}
      onChange={handleTemperatureChange}
      onBlur={handleTemperatureBlur}
      id="temperature-edit"
      InputProps={{
        endAdornment: <InputAdornment position="end">°C</InputAdornment>,
      }}
    />
  ) : null

  const commentEdit = isEditing ? (
    <TextField
      className={classes.commentEdit}
      value={comment}
      multiline={true}
      rowsMax={100}
      placeholder="Enter a comment"
      onChange={handleCommentChange}
      onBlur={handleCommentBlur}
    />
  ) : null
  
  const editableConditions = isEditing && availableConditions.length > 0 ? (
    <div className={classes.chipRow}>
      {availableWeatherConditions.map((condition: Condition, index: number) => (
        <Chip
          className={classes.chip}
          label={condition}
          variant={selected(condition) ? 'default' : 'outlined'}
          onClick={handleWeatherConditionToggle}
          key={index}
        />
      ))}
      {availableConditions.map((condition: Condition, index: number) => (
        <Chip
          className={classes.chip}
          label={condition}
          variant={selected(condition) ? 'default' : 'outlined'}
          onClick={handleConditionToggle}
          key={index}
        />
      ))}
    </div>
  ) : null

  const createColorChip = (styleClass: string, label: string, name: string, color: 'primary' | 'secondary', index: number) => {
    const variant = isEditing && game.illegalScorers.find(n => n === name) ? 'default' : 'outlined'
    const classs = isEditing && game.illegalScorers.find(n => n === name) ? classes.illegalChip : styleClass
    return (
      <Chip
        classes={{ icon: classs } as any}
        icon={<Chip color={color} variant={variant} label={label} />}
        label={name}
        variant="outlined"
        color={color}
        onClick={handlePlayerClipClick}
        className={classes.chip}
        key={index}
      />
    )
  }

  const illegalAndHighScorers = (
    <div className={classes.chipRow}>
      {isEditing ? null : game.highScorers.map((name: string, index: number) => {
        return createColorChip(classes.highScoreChip, 'High score', name, 'primary', index)
      })}
      {game.illegalScorers.map((name: string, index: number) => {
        return createColorChip(classes.illegalChip, 'Illegal game', name, 'secondary', index)
      })}
    </div>
  )

  const illegalScorerEdit = isEditing ? (
    <div className={classes.chipRow}>
      {game.scores.map((scores: PlayerScores, index: number) => {
        return createColorChip(classes.illegalDisabledChip, 'Illegal game', scores.player.firstName, 'secondary', index)
      })}
    </div>
  ) : null

  const shouldShowInfoPaper = game.temperature || game.weatherConditions.length || game.conditions.length ||
                              game.highScorers.length || game.illegalScorers.length || game.comment || game.contestName

  const normalView = shouldShowInfoPaper ? (
    <Paper className = {classes.infoPaper} elevation = { 0} >
      {conditions}
      {illegalAndHighScorers}
      <Typography className={classes.comment} align="left" variant="body1"> {game.comment}</Typography>
    </Paper>
  ) : null

  const editingView = isEditing ? (
    <Paper className={classes.infoPaper} elevation={0}>
      {temperatureEdit}
      {editableConditions}
      {illegalScorerEdit}
      {commentEdit}
    </Paper>
  ) : null

  return isEditing ? editingView : normalView
}

export default GameInfo
