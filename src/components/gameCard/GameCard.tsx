import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { IconButton, withStyles } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

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
  spinner: {
    padding: 5,
  },
}))

const GameDateTextField = withStyles({
  root: {
    '& label': {
      color: 'white',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
      color: 'white',
    },
    marginTop: 5,
    marginBottom: 10,
  },
})(TextField)

interface Props {
  game: Game,
  setGame: (game: Game) => void,
}

// TODO: if startDate != null, render "1.1.1111 9.30 - 10.45"
// TODO: When isEditing == true, hide new game button
// TODO: update game & backend after editing done (also after individual edits).

const GameCard: React.FC<Props> = (props) => {
  const classes = useStyles()
  const { game, setGame } = props

  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)

  // TODO(?): if game.creator == user || user.isAdmin
  const allowedToEdit = true

  const updateGame = (game: Game) => {
    // TODO: Check that the spinner shows up
    gamesService.updateGame(game).then(() => setUpdating(false))
    setGame(game)
    setUpdating(true)
  }

  const editButton = allowedToEdit ? (
    <IconButton aria-label="edit" className={classes.actionButton} onClick={() => setIsEditing(!isEditing)}>
      {isEditing ? (<DoneIcon />) : (<EditIcon />)}
    </IconButton>
  ) : null

  const progressSpinner = (
    <div className={classes.actionButton}>
      <CircularProgress className={classes.spinner} size={40} />
    </div>
  )

  const actionButton = updating ? progressSpinner : editButton

  const gameDate = (
    <Typography variant="subtitle1" className={classes.title}>{game.endDate}</Typography>
  )

  // TODO: Validation for date, calendar value picker?
  const gameDateEditing = (
    <div>
      <GameDateTextField
        id="gamedate-start-edit"
        label="Start"
        variant="outlined"
        size="small"
        defaultValue={game.startDate}
      />
      <GameDateTextField
        id="gamedate-end-edit"
        label="End"
        variant="outlined"
        size="small"
        defaultValue={game.endDate}
      />
    </div>
  )

  return (
    <BlueCard>
      <Typography variant="h6" className={classes.title}>{game.course.name}</Typography>
      {isEditing ? gameDateEditing : gameDate}
      {actionButton}
      <ScoreCard game={game} setGame={updateGame} isEditing={isEditing} />
      <GameInfo game={game} />
    </BlueCard>
  )
}

export default GameCard
