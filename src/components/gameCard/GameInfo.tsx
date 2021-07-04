import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { InputAdornment, TextField } from '@material-ui/core'

import PlayerCommentInput from './PlayerCommentInput'
import GameChips from './GameChips'
import GamePhotos from './GamePhotos'

export const chipHeight = 22

const useStyles = makeStyles((theme) => ({
  infoPaper: {
    marginBottom: 10,
    padding: theme.spacing(1),
    textAlign: 'left',
  },
  comment: {
    marginTop: 5,
  },
  temperatureEdit: {
    width: 130,
    marginBottom: theme.spacing(2),
  },
  commentEdit: {
    width: '100%',
    marginTop: 10,
    marginBottom: 50, // Make room for 'Save' and 'Cancel' buttons.
  },
}), { name: 'MuiHook' })

interface Props {
  game: Game,
  setGame: (game: Game) => void,
  sendGame: (game?: Game) => void,
  show: boolean,
  isEditing: boolean,
  availableWeatherConditions: Tag[],
  availableConditions: Tag[],
  userId: string | undefined,
  setIsCommentPromptDirty: (isDirty: boolean) => void,
}

const GameInfo: React.FC<Props> = (props) => {
  const classes = useStyles()
  const {
    game,
    setGame,
    sendGame,
    show,
    isEditing,
    availableWeatherConditions,
    availableConditions,
    userId,
    setIsCommentPromptDirty,
  } = props
  const shouldShowInfoPaper = show

  const [temperature, setTemperature] = useState<string>('')
  const usersComment = game.comments.find(c => c.userId === userId)
  const [commentContent, setCommentContent] = useState<string | undefined>(usersComment?.content)
  const [chosenUserTagHistory, setChosenUserTagHistory] = useState<Tag[]>([])

  useEffect(() => {
    // Check with '!=' on purpose to catch a string 'null'.
    // eslint-disable-next-line
    const gameTemperature = (game.temperature != null || game.temperature != undefined) ? String(game.temperature) : ''
    setTemperature(gameTemperature)
  }, [game])

  const sendGameCommentUpdate = (game?: Game) => {
    const updatedUsersComment = game?.comments.find(c => c.userId === userId)
    setCommentContent(updatedUsersComment?.content)
    sendGame(game)
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
    setCommentContent(event.target.value)
  }

  const handleCommentBlur = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (usersComment && commentContent !== undefined) {
      const otherComments = game.comments.filter(c => c.userId !== userId)
      usersComment.content = commentContent
      game.comments = [usersComment, ...otherComments]
      setGame(game)
    }
  }

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
      value={commentContent}
      multiline={true}
      rowsMax={100}
      placeholder="Your comment"
      onChange={handleCommentChange}
      onBlur={handleCommentBlur}
    />
  ) : null

  let userCommentEmpty = true
  
  const comments = game.comments.map(comment => {
    const commenter = game.scores.find(s => s.player.id === comment.userId)?.player
    if (commenter?.id === userId && comment.content.length > 0) {
      userCommentEmpty = false
    }
    return comment.content.length > 0 ? (
      <Typography
        key={comment.id}
        className={classes.comment}
        align="left"
        variant="body1"
      >
        {commenter?.firstName ?? 'Admin'}: {comment.content}
      </Typography>
    ) : null
  })

  const threeMonthsAgo = new Date().setMonth(new Date().getMonth() - 3)
  const gameEndedLessThanThreeMonthsAgo = +game.endDate > +threeMonthsAgo

  const userIsInGame = game.scores.find(s => s.player.id === userId) !== undefined
  const showCommentPrompt = userCommentEmpty && userIsInGame && gameEndedLessThanThreeMonthsAgo

  const gameChips = (
    <GameChips
      game={game}
      setGame={setGame}
      isEditing={isEditing}
      availableWeatherConditions={availableWeatherConditions}
      availableConditions={availableConditions}
      chosenUserTagHistory={chosenUserTagHistory}
      setChosenUserTagHistory={setChosenUserTagHistory}
    />
  )

  const gamePhotos = (
    <GamePhotos
      game={game}
      setGame={setGame}
      isEditing={isEditing}
    />
  )

  const normalView = shouldShowInfoPaper || showCommentPrompt ? (
    <Paper className = {classes.infoPaper} elevation = {0}>
      {gameChips}

      {gamePhotos}

      {comments}

      {showCommentPrompt ? (
        <PlayerCommentInput
          game={game}
          userId={userId}
          sendGame={sendGameCommentUpdate}
          setIsCommentPromptDirty={setIsCommentPromptDirty}
        />
      ) : null}
    </Paper>
  ) : null

  const editingView = isEditing ? (
    <Paper className={classes.infoPaper} elevation={0}>
      {temperatureEdit}
      
      {gameChips}

      {gamePhotos}

      {commentEdit}
    </Paper>
  ) : null

  return isEditing ? editingView : normalView
}

export default GameInfo
