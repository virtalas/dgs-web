import React, { useEffect, useState, useRef } from 'react'
import { CancelTokenSource } from 'axios'
import _ from 'lodash'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core'
import DayjsUtils from '@date-io/dayjs'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'

import { useAuth } from '../../context/AuthContext'
import ScoreCard from './ScoreCard'
import GameInfo from './GameInfo'
import BlueCard from './BlueCard'
import gamesService from '../../services/gamesService'
import baseService from '../../services/baseService'
import ActionButton from './ActionButton'
import { areOnSameDay } from '../../utils/DateUtils'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'white',
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
  onGameDeleted?: (game: Game) => void,
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

  const { userId } = useAuth()
  const {
    game,
    setGame,
    onGameDeleted,
    editOnly,
    autoUpdating,
    disableScoreEditing,
    availableConditions,
    availableWeatherConditions,
    onEditToggle,
  } = props

  const [isEditing, setIsEditing] = useState(editOnly ? true : false) // to get rid of undefined
  const [isCommentPromptDirty, setIsCommentPromptDirty] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState(false)
  const [originalGame, setOriginalGame] = useState<Game>()

  const gameInfoIsShown = game.temperature ||
                          game.weatherConditions.length ||
                          game.conditions.length ||
                          game.highScorers.length ||
                          game.illegalScorers.length ||
                          game.tags.length ||
                          game.comments.reduce((totalLength, comment) => totalLength + comment.content.length, 0)

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  useEffect(() => () => cancelTokenSourceRef.current?.cancel(), [])

  const sendUpdatedGame = (updatedGame?: Game) => {
    cancelTokenSourceRef.current = baseService.cancelTokenSource()

    const gameToSend = updatedGame !== undefined ? updatedGame : game

    gamesService.updateGame(gameToSend, userId ?? '', cancelTokenSourceRef.current)
      .then((returnedGame: Game) => {
        setGame(returnedGame)
        setUpdating(false)
      })
      .catch((e) => {
        setUpdateError(true)
        if (originalGame) {
          setGame(originalGame)
        }
      })

    setUpdating(true)
    setUpdateError(false)
  }

  const toggleEdit = () => {
    if (isEditing) {
      sendUpdatedGame()
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
      // TODO: Check if any new photos were added; call DELETE for them to the API.
      if (originalGame) {
        setGame(originalGame)
      }
      if (onEditToggle) {
        onEditToggle(!isEditing)
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

  const handleDelete = () => {
    // TODO: Use Material ui Dialog component
    if (!window.confirm('Delete game?')) {
      return
    }

    cancelTokenSourceRef.current = baseService.cancelTokenSource()
    gamesService.deleteGame(game, cancelTokenSourceRef.current)
      .then(() => {
        if (onEditToggle) {
          onEditToggle(false)
        }
        if (onGameDeleted) {
          onGameDeleted(game)
        }
      })
  }
  
  const showLoading = ((updating || autoUpdating) && !updateError) ?? false

  const editButton = game.allowedToEdit && !editOnly && !isCommentPromptDirty ? (
    <ActionButton
      variant="edit"
      position={gameInfoIsShown ? 'bottom' : 'top'}
      error={!isEditing && updateError}
      loading={showLoading}
      onClick={toggleEdit}
    />
  ) : null

  const doneButton = (
    <ActionButton
      variant={editOnly ? 'loadingOnly' : 'ok'}
      position="bottom"
      loading={showLoading}
      onClick={toggleEdit}
    />
  )

  const actionButton = isEditing ? doneButton : editButton

  const cancelButton = isEditing && !editOnly ? (
    <ActionButton
      variant="cancel"
      position="bottom"
      secondary={true}
      onClick={handleCancelEdit}
    />
  ) : null

  const deleteButton = isEditing && !editOnly ? (
    <ActionButton
      variant="delete"
      position="bottom"
      third={true}
      loading={showLoading}
      onClick={handleDelete}
    />
  ) : null

  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  
  const endDateTime = game.endDate.toLocaleString('en-FI', dateOptions)
  const endTime = game.endDate.toLocaleString('en-FI', { hour: 'numeric', minute: 'numeric' })
  const endString = areOnSameDay(game.startDate, game.endDate) ? endTime : endDateTime

  const startDateTime = game.startDate ? game.startDate.toLocaleString('en-FI', dateOptions) : null
  const startString = startDateTime ? startDateTime + ' - ' : ''

  const dateTime = startString + endString

  const gameDate = (
    <Typography variant="subtitle1" className={classes.title}>{dateTime}</Typography>
  )

  const gameDateEditing = (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      {game.startDate ? (
        <DatePicker
          margin="normal"
          id="gamedate-start-edit"
          label="Start date"
          format="HH:mm DD.MM.YYYY"
          value={game.startDate}
          onChange={handleStartDateChange}
        />
      ) : <div>{/* MuiPickersUtilsProvider does not like null/undefined, so pass empty div here. */}</div>}
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

      {deleteButton}
      {cancelButton}
      {actionButton}

      <ScoreCard game={game} setGame={setGame} isEditing={disableScoreEditing ? false : isEditing} />

      <GameInfo
        game={game}
        setGame={setGame}
        sendGame={sendUpdatedGame}
        show={Boolean(gameInfoIsShown)}
        isEditing={isEditing}
        availableWeatherConditions={availableWeatherConditions}
        availableConditions={availableConditions}
        userId={userId}
        setIsCommentPromptDirty={setIsCommentPromptDirty}
      />
    </BlueCard>
  )
}

export default GameCard
