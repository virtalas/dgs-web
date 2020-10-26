import React, { useState } from 'react'
import _ from 'lodash'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { IconButton, withStyles } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import CircularProgress from '@material-ui/core/CircularProgress'
import DayjsUtils from '@date-io/dayjs'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import ScoreCard from './ScoreCard'
import GameInfo from './GameInfo'
import BlueCard from './BlueCard'
import gamesService from '../../services/gamesService'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'white',
  },
  actionButton: {
    position: 'absolute',
    bottom: 10,
    right: 8,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 10,
    right: 55,
  },
  spinner: {
    padding: 5,
  },
}))

const DatePicker = withStyles({
  root: {
    '& label': {
      color: 'white',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    marginTop: 5,
    marginBottom: 10,
  },
})(DateTimePicker)

interface Props {
  game: Game,
  setGame: (game: Game) => void,
}

// TODO: When isEditing == true, hide new game button
// TODO: Position of edit button when there is no GameInfo
// TODO: 'Save' and 'Cancel' texts to buttons

const GameCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, setGame } = props

  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [availableWeatherConditions, setAvailableWeatherConditions] = useState<Condition[]>([])
  const [availableConditions, setAvailableConditions] = useState<Condition[]>([])
  const [originalGame, setOriginalGame] = useState<Game>()
  // TODO: Fix(?) hack variable to make React render the game again.
  // Affects: when editing a stroke, the color should change after a number inputted and onfocus happens.
  // Works in commit 6ec7087d99bfdf40bd4ae977f7f572c977e04f34
  const [update, updateChildren] = useState(false)

  // TODO(?): if game.creator == user || user.isAdmin
  const allowedToEdit = true

  const toggleEdit = () => {
    if (isEditing) {
      // TODO: Check that the spinner shows up
      // TODO: setGame(returnedGame) in then() of gamesService.updateGame
      gamesService.updateGame(game).then(() => setUpdating(false))
      setUpdating(true)
    } else if (availableWeatherConditions.length === 0) {
      setOriginalGame(_.cloneDeep(game))
      // Fetch available conditions for editing.
      gamesService.getAvailableWeatherConditions().then(c => setAvailableWeatherConditions(c))
      gamesService.getAvailableConditions().then(c => setAvailableConditions(c))
    }
    setIsEditing(!isEditing)
  }

  const handleCancelEdit = () => {
    if (window.confirm('Cancel editing?')) {
      if (originalGame) {
        updateGame(originalGame) // TODO: BUG: Original game does is not rendered
      }
      setIsEditing(!isEditing)
    }
  }

  const updateGame = (game: Game) => {
    setGame(game)
    updateChildren(!update)
  }

  const handleStartDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
    const newDate = date?.toDate()
    if (newDate) {
      game.startDate = newDate
      updateGame(game)
    }
  }

  const handleEndDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
    const newDate = date?.toDate()
    if (newDate) {
      game.endDate = newDate
      updateGame(game)
    }
  }

  const editButton = allowedToEdit ? (
    <IconButton aria-label="edit" className={classes.actionButton} onClick={toggleEdit}>
      {isEditing ? (<DoneIcon />) : (<EditIcon />)}
    </IconButton>
  ) : null

  const cancelButton = isEditing ? (
    <IconButton aria-label="edit" className={classes.cancelButton} onClick={handleCancelEdit}>
      <ClearIcon />
    </IconButton>
  ) : null

  const progressSpinner = (
    <div className={classes.actionButton}>
      <CircularProgress className={classes.spinner} size={40} />
    </div>
  )

  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  const endDateTime = game.endDate.toLocaleString('fi-FI', dateOptions)
  const endTime = game.endDate.toLocaleString('fi-FI', { hour: 'numeric', minute: 'numeric' })
  const startDateTime = game.startDate ? game.startDate.toLocaleString('fi-FI', dateOptions) : null
  const dateTime = startDateTime ? startDateTime + ' - ' + endTime : endDateTime
  const gameDate = (
    <Typography variant="subtitle1" className={classes.title}>{dateTime}</Typography>
  )

  // TODO: Validation for date, calendar value picker?
  const gameDateEditing = (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <DatePicker
        margin="normal"
        id="gamedate-start-edit"
        label="Start date"
        format="HH:mm DD.MM.YYYY"
        value={game.startDate}
        onChange={handleStartDateChange}
      />
      <DatePicker
        margin="normal"
        id="gamedate-end-edit"
        label="End date"
        format="HH:mm DD.MM.YYYY"
        value={game.endDate}
        onChange={handleEndDateChange}
      />
    </MuiPickersUtilsProvider>
  )

  return (
    <BlueCard>
      <Typography variant="h6" className={classes.title}>{game.course.name}</Typography>
      {isEditing ? gameDateEditing : gameDate}
      {isEditing ? cancelButton : null}
      {updating ? progressSpinner : editButton}
      <ScoreCard game={game} setGame={updateGame} isEditing={isEditing} />
      <GameInfo
        game={game}
        setGame={updateGame}
        isEditing={isEditing}
        availableWeatherConditions={availableWeatherConditions}
        availableConditions={availableConditions}
      />
    </BlueCard>
  )
}

export default GameCard
