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
                          game.comments.reduce((totalLength, comment) => totalLength + comment.content.length, 0)

  const userIsInGame = game.scores.find(s => s.player.id === userId) !== undefined
  const allowedToEdit = userIsInGame // TODO: or currentUser.isAdmin

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
  
  const showLoading = ((updating || autoUpdating) && !updateError) ?? false

  const editButton = allowedToEdit && !editOnly ? (
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
      />
    </BlueCard>
  )
}

export default GameCard
