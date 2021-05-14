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
}), { name: 'MuiHook' })

interface Props {
  game: Game,
  setGame: (game: Game) => void,
  isEditing: boolean,
  availableWeatherConditions: Tag[],
  availableConditions: Tag[],
}

const GameInfo: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, setGame, isEditing, availableWeatherConditions, availableConditions } = props

  // eslint-disable-next-line
  const gameTemperature = game.temperature != null || game.temperature != undefined ? game.temperature : ''
  const [temperature, setTemperature] = useState<string>(String(gameTemperature))
  const [comment, setComment] = useState<string>(game.comment)

  const handlePlayerChipClick = (event: React.MouseEvent) => {
    const playerId = event.currentTarget.getAttribute('data-playerid')
    const player = game.scores.find(scores => scores.player.id === playerId)?.player

    if (isEditing) {
      if (game.illegalScorers.find(player => player.id === playerId)) {
        game.illegalScorers = game.illegalScorers.filter(player => player.id !== playerId)
      } else {
        if (player) {
          game.illegalScorers = game.illegalScorers.concat(player)
        }
      }
      setGame(game)
    } else {
      // TODO
      alert('Coming soon: Go to player\'s page!')
    }
  }

  const handleTagChipClick = () => {
    // TODO
    alert('Coming soon: Search games by clicked condition!')
  }

  const handleAddTagClick = () => {
    // TODO
    alert('Coming soon: add a new tag!')
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
    game.temperature = temperature === '' ? undefined : Number(temperature)
    setGame(game)
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value)
  }

  const handleCommentBlur = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    game.comment = comment
    setGame(game)
  }

  const handleConditionTagToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const tagId = event.currentTarget.getAttribute('data-tagid')
    const tag = availableConditions.find(t => t.id === tagId)
    if (arrayContainsTag(game.conditions, tag)) {
      game.conditions = game.conditions.filter(t => t.id !== tagId)
    } else if (tag) {
      game.conditions = game.conditions.concat(tag)
    }
    setGame(game)
  }

  const handleWeatherTagToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const tagId = event.currentTarget.getAttribute('data-tagid')
    const tag = availableWeatherConditions.find(t => t.id === tagId)
    if (arrayContainsTag(game.weatherConditions, tag)) {
      game.weatherConditions = game.weatherConditions.filter(t => t.id !== tagId)
    } else if (tag) {
      game.weatherConditions = game.weatherConditions.concat(tag)
    }
    setGame(game)
  }

  const tagIsSelected = (condition: Tag): boolean => {
    if (game.weatherConditions.find(tag => tag.id === condition.id)) {
      return true
    }
    if (game.conditions.find(tag => tag.id === condition.id)) {
      return true
    }
    return false
  }

  game.conditions.sort()
  game.weatherConditions.sort()

  const conditions = (
    <div className={classes.chipRow}>
      {game.temperature ? <Chip className={classes.chip} label={game.temperature + " °C"} onClick={handleTagChipClick} /> : null}
      {game.weatherConditions.map((condition: Tag, index: number) => (
        <Chip className={classes.chip} label={condition.name} onClick={handleTagChipClick} key={index} />
      ))}
      {game.conditions.map((condition: Tag, index: number) => (
        <Chip className={classes.chip} label={condition.name} onClick={handleTagChipClick} key={index} />
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
      id="commentEdit"
      className={classes.commentEdit}
      value={comment}
      multiline={true}
      rowsMax={100}
      placeholder="Enter a comment"
      onChange={handleCommentChange}
      onBlur={handleCommentBlur}
    />
  ) : null
  
  const editableTags = isEditing ? (
    <div className={classes.chipRow}>
      {availableWeatherConditions.map((condition: Tag, index: number) => (
        <Chip
          data-cy="weatherConditionChip"
          className={classes.chip}
          label={condition.name}
          variant={tagIsSelected(condition) ? 'default' : 'outlined'}
          onClick={handleWeatherTagToggle}
          data-tagid={condition.id}
          key={index}
        />
      ))}
      {availableConditions.map((condition: Tag, index: number) => (
        <Chip
          className={classes.chip}
          label={condition.name}
          variant={tagIsSelected(condition) ? 'default' : 'outlined'}
          onClick={handleConditionTagToggle}
          data-tagid={condition.id}
          key={index}
        />
      ))}
      <Chip
          className={classes.chip}
          label="add tag"
          variant="outlined"
          onClick={handleAddTagClick}
        />
    </div>
  ) : null

  const createColorChip = (styleClass: string, label: string, player: Player, color: 'primary' | 'secondary', index: number) => {
    const variant = isEditing && game.illegalScorers.find(p => p.id === player.id) ? 'default' : 'outlined'
    const classs = isEditing && game.illegalScorers.find(p => p.id === player.id) ? classes.illegalChip : styleClass
    return (
      <Chip
        classes={{ icon: classs } as any}
        icon={<Chip color={color} variant={variant} label={label} />}
        label={player.firstName}
        variant="outlined"
        color={color}
        data-playerid={player.id}
        onClick={handlePlayerChipClick}
        className={classes.chip}
        key={index}
      />
    )
  }

  const illegalAndHighScorers = (
    <div className={classes.chipRow}>
      {isEditing ? null : game.highScorers.map((player: Player, index: number) => {
        return createColorChip(classes.highScoreChip, 'High score', player, 'primary', index)
      })}
      {game.illegalScorers.map((player: Player, index: number) => {
        return createColorChip(classes.illegalChip, 'Illegal game', player, 'secondary', index)
      })}
    </div>
  )

  const illegalScorerEdit = isEditing ? (
    <div className={classes.chipRow}>
      {game.scores.map((scores: PlayerScores, index: number) => {
        return createColorChip(classes.illegalDisabledChip, 'Illegal game', scores.player, 'secondary', index)
      })}
    </div>
  ) : null

  const shouldShowInfoPaper = game.temperature || game.weatherConditions.length || game.conditions.length ||
                              game.highScorers.length || game.illegalScorers.length || game.comment

  const normalView = shouldShowInfoPaper ? (
    <Paper className = {classes.infoPaper} elevation = { 0} >
      {conditions}
      {illegalAndHighScorers}
      <Typography
        id="comment"
        className={classes.comment}
        align="left"
        variant="body1"
      >
        {game.comment}
      </Typography>
    </Paper>
  ) : null

  const editingView = isEditing ? (
    <Paper className={classes.infoPaper} elevation={0}>
      {temperatureEdit}
      {editableTags}
      {illegalScorerEdit}
      {commentEdit}
    </Paper>
  ) : null

  return isEditing ? editingView : normalView
}

function arrayContainsTag(array: Tag[], tag: Tag | undefined): boolean {
  if (tag !== undefined && array.find(t => t.id === tag.id)) {
    return true
  }
  return false
}

export default GameInfo
