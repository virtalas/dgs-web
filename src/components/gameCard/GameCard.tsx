import React, { useEffect, useState, useRef } from 'react'
import { CancelTokenSource } from 'axios'
import _ from 'lodash'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { IconButton, withStyles } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import DayjsUtils from '@date-io/dayjs'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import ScoreCard from './ScoreCard'
import GameInfo from './GameInfo'
import BlueCard from './BlueCard'
import gamesService from '../../services/gamesService'
import baseService from '../../services/baseService'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'white',
  },
  actionAreaBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    zIndex: 10,
  },
  actionAreaTopRight: {
    position: 'absolute',
    top: 10,
    right: 8,
    zIndex: 10,
    color: 'white',
  },
  cancelButton: {
    position: 'absolute',
    bottom: 10,
    right: 55,
  },
  spinner: {
    padding: 5,
  },
  error: {
    marginRight: 40,
    color: 'red',
  }
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
  editOnly?: boolean,
  autoUpdating?: boolean,
  disableScoreEditing?: boolean,
  availableConditions: Tag[],
  availableWeatherConditions: Tag[],
  onEditToggle?: (isEditing: boolean) => void,
}

// TODO: Display course name in big font, then layout name somewhere smaller?
// TODO: When isEditing == true, hide new game button
// TODO: Position of edit button when there is no GameInfo
// TODO: 'Save' and 'Cancel' texts to buttons
// TODO: Add a button: 'Continue adding scores', that links to Game inputting view.
// TODO: View pictures. Game JSON stores how many pictures, and then use Material UI 'Skeleton' while loading.
// TODO: Ability to add user-created tags

const GameCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const {
    game,
    setGame,
    editOnly,
    autoUpdating,
    disableScoreEditing,
    availableConditions,
    availableWeatherConditions,
    onEditToggle,
  } = props

  const [isEditing, setIsEditing] = useState(editOnly ? true : false) // to get rid of undefined
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(false)
  const [originalGame, setOriginalGame] = useState<Game>()

  const gameInfoIsShown = game.temperature ||
                          game.weatherConditions.length ||
                          game.conditions.length ||
                          game.highScorers.length ||
                          game.illegalScorers.length ||
                          game.comment

  const actionAreaClass = gameInfoIsShown ? classes.actionAreaBottomRight : classes.actionAreaTopRight

  // TODO: if game.creatorId == userId || currentUser.isAdmin
  const allowedToEdit = true

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => cancelTokenSourceRef.current?.cancel())

  const toggleEdit = () => {
    if (isEditing) {
      cancelTokenSourceRef.current = baseService.cancelTokenSource()
      gamesService.updateGame(game, cancelTokenSourceRef.current)
        .then((returnedGame: Game) => {
          setGame(returnedGame)
          setUpdating(false)
        })
        .catch(() => {
          setUpdateError(true)
          if (originalGame) {
            setGame(originalGame)
          }
        })
      setUpdating(true)
      setUpdateError(false)
    } else {
      setOriginalGame(_.cloneDeep(game))
    }

    if (onEditToggle) {
      onEditToggle(!isEditing)
    }

    setIsEditing(!isEditing)
  }

  const handleCancelEdit = () => {
    if (window.confirm('Cancel editing?')) {
      if (originalGame) {
        setGame(originalGame)
      }
      setIsEditing(!isEditing)
    }
  }

  const handleStartDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
    const newDate = date?.toDate()
    if (newDate) {
      game.startDate = newDate
      setGame(game)
    }
  }

  const handleEndDateChange = (date: MaterialUiPickersDate, value?: string | null | undefined) => {
    const newDate = date?.toDate()
    if (newDate) {
      game.endDate = newDate
      setGame(game)
    }
  }                          

  const editButton = allowedToEdit && !editOnly ? (
    <IconButton
      data-cy="editGameButton"
      aria-label="edit"
      className={actionAreaClass}
      onClick={toggleEdit}
    >
      <EditIcon />
    </IconButton>
  ) : null

  const doneButton = (
    <IconButton
      data-cy="editGameDoneButton"
      aria-label="done"
      className={classes.actionAreaBottomRight}
      onClick={toggleEdit}
    >
      <DoneIcon />
    </IconButton>
  )

  const lowerRightButton = isEditing ? doneButton : editButton

  const cancelButton = isEditing ? (
    <IconButton aria-label="edit" className={classes.cancelButton} onClick={handleCancelEdit}>
      <ClearIcon />
    </IconButton>
  ) : null

  const progressSpinner = (
    <div className={actionAreaClass}>
      <CircularProgress className={classes.spinner} size={40} color={gameInfoIsShown ? 'primary' : 'inherit' } />
    </div>
  )

  const errorIndicator = (
    <div className={actionAreaClass} title="Updating game failed">
      <ErrorOutlineIcon className={classes.error} fontSize="large" />
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
      <Typography variant="h6" className={classes.title}>{game.courseName + ', ' + game.layout.name}</Typography>
      {isEditing ? gameDateEditing : gameDate}
      {isEditing && !editOnly ? cancelButton : null}
      {!isEditing && updateError ? errorIndicator : null}
      {updating && !updateError ? progressSpinner : lowerRightButton}
      {autoUpdating ? progressSpinner : null}
      <ScoreCard game={game} setGame={setGame} isEditing={disableScoreEditing ? false : isEditing} />
      <GameInfo
        game={game}
        setGame={setGame}
        isEditing={isEditing}
        availableWeatherConditions={availableWeatherConditions}
        availableConditions={availableConditions}
      />
    </BlueCard>
  )
}

export default GameCard
